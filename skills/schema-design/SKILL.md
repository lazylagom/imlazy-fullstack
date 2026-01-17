---
name: Schema Design
description: This skill provides Prisma and Drizzle ORM schema design patterns, ERD design, and database architecture. Use when the user asks about "Prisma schema", "Drizzle schema", "ERD design", "database modeling", "relations", "indexes", "스키마 설계", "데이터베이스 구조", or "테이블 관계".
version: 1.0.0
---

# Database Schema Design Patterns

## Prisma Schema Basics

### Model Definition

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // mysql, sqlite, mongodb
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?
  role      Role     @default(USER)
  posts     Post[]
  comments  Comment[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")  // 테이블명 지정
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

## Relation Patterns

### One-to-Many (1:N)

```prisma
model User {
  id    String @id @default(cuid())
  posts Post[]  // User has many Posts
}

model Post {
  id       String @id @default(cuid())
  author   User   @relation(fields: [authorId], references: [id])
  authorId String

  @@index([authorId])  // 외래키 인덱스 필수
}
```

### Many-to-Many (N:M)

**Implicit (자동 중간 테이블)**:
```prisma
model Post {
  id   String @id @default(cuid())
  tags Tag[]
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
}
```

**Explicit (직접 중간 테이블 정의)**:
```prisma
model Post {
  id       String     @id @default(cuid())
  postTags PostTag[]
}

model Tag {
  id       String     @id @default(cuid())
  name     String     @unique
  postTags PostTag[]
}

model PostTag {
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    String
  tag       Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)
  tagId     String
  assignedAt DateTime @default(now())

  @@id([postId, tagId])  // 복합 기본키
}
```

### Self-Relation

```prisma
model User {
  id          String  @id @default(cuid())
  name        String

  // Self-relation for followers
  followers   Follow[] @relation("following")
  following   Follow[] @relation("followers")
}

model Follow {
  follower    User     @relation("followers", fields: [followerId], references: [id])
  followerId  String
  following   User     @relation("following", fields: [followingId], references: [id])
  followingId String
  createdAt   DateTime @default(now())

  @@id([followerId, followingId])
}
```

## Common Patterns

### Soft Delete

```prisma
model Post {
  id        String    @id @default(cuid())
  title     String
  deletedAt DateTime?  // null = not deleted

  @@index([deletedAt])
}
```

**Query with soft delete**:
```typescript
// 삭제되지 않은 게시물만 조회
const posts = await db.post.findMany({
  where: { deletedAt: null }
});

// Soft delete
await db.post.update({
  where: { id },
  data: { deletedAt: new Date() }
});
```

### Polymorphic Relations

```prisma
model Comment {
  id          String      @id @default(cuid())
  content     String

  // Polymorphic: can belong to Post or Video
  commentable String      // "post" | "video"
  entityId    String

  @@index([commentable, entityId])
}
```

### UUID vs CUID

| Type | Pros | Cons | Use Case |
|------|------|------|----------|
| `cuid()` | 짧음, 정렬 가능 | 예측 가능 | 일반적 사용 |
| `uuid()` | 표준, 보안적 | 길이, 정렬 불가 | 외부 노출 ID |
| `autoincrement()` | 빠름, 간단 | 예측 가능, 분산 어려움 | 내부 전용 |

## Indexes

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique  // 단일 유니크 인덱스
  authorId  String
  status    String
  createdAt DateTime @default(now())

  @@index([authorId])                    // 단일 인덱스
  @@index([status, createdAt])           // 복합 인덱스
  @@index([title], map: "post_title_idx") // 명명된 인덱스
}
```

## Drizzle ORM

### Schema Definition

```typescript
// lib/db/schema.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content'),
  authorId: uuid('author_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

## Zod Schema Integration

```typescript
// lib/validations/post.ts
import { z } from 'zod';

export const CreatePostSchema = z.object({
  title: z.string()
    .min(1, '제목을 입력하세요')
    .max(100, '제목은 100자 이내로 입력하세요'),
  content: z.string()
    .min(10, '내용은 10자 이상이어야 합니다')
    .optional(),
  tags: z.array(z.string()).max(5, '태그는 최대 5개까지').optional(),
});

export const UpdatePostSchema = CreatePostSchema.partial();

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;
```

## Best Practices

1. **Always index foreign keys** - 관계 쿼리 성능 향상
2. **Use soft delete for important data** - 복구 가능성 확보
3. **Separate read/write models** - 복잡한 쿼리 최적화
4. **Validate at the edge** - Zod로 런타임 검증
5. **Use transactions for related operations** - 데이터 일관성

## References

See `examples/` for complete schema examples:
- `examples/blog-schema.prisma` - 블로그 스키마
- `examples/ecommerce-schema.prisma` - 이커머스 스키마
- `examples/social-schema.prisma` - 소셜 네트워크 스키마
