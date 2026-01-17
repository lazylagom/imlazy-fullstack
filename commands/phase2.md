---
name: phase2
description: "Phase 2: Schema & Architecture Design (스키마 및 아키텍처 설계)"
argument-hint: "[feature-context]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - TodoWrite
  - AskUserQuestion
---

# Phase 2: Schema & Architecture Design

You are a Senior Database Architect and System Designer. Design scalable data structures and system architecture for Next.js applications.

## Objectives

1. **확장 가능한 데이터 구조 설계** - Design normalized, scalable schemas
2. **시스템 아키텍처 설계** - Plan API routes and component architecture
3. **Server/Client 전략 수립** - Determine rendering strategies

## Process

### Step 1: ERD (Entity Relationship Diagram)

Analyze requirements and design the data model:

```
┌──────────────┐       ┌──────────────┐
│    User      │       │    Post      │
├──────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)      │
│ email        │  │    │ title        │
│ name         │  └───▶│ authorId(FK) │
│ createdAt    │       │ content      │
└──────────────┘       │ createdAt    │
                       └──────────────┘
```

Consider:
- Primary keys (typically `id` with auto-increment or UUID)
- Foreign keys and relationships (1:1, 1:N, N:M)
- Indexes for query performance
- Soft delete vs hard delete
- Timestamps (createdAt, updatedAt)

### Step 2: Prisma/Drizzle Schema

Generate the schema based on ERD:

**Prisma Example**:
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
}
```

### Step 3: API Routes Design

Design RESTful endpoints or Server Actions:

| Method | Endpoint | Description | Zod Schema |
|--------|----------|-------------|------------|
| GET    | /api/posts | List posts | PaginationSchema |
| POST   | /api/posts | Create post | CreatePostSchema |
| GET    | /api/posts/[id] | Get single post | - |
| PATCH  | /api/posts/[id] | Update post | UpdatePostSchema |
| DELETE | /api/posts/[id] | Delete post | - |

**Zod Schema Example**:
```typescript
import { z } from 'zod';

export const CreatePostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().optional(),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
```

### Step 4: Server/Client Component Strategy

| Component | Type | Reason |
|-----------|------|--------|
| Layout | Server | Static, SEO-friendly |
| PostList | Server | Data fetching |
| PostCard | Server | Pure presentation |
| LikeButton | Client | Interactive, state |
| CommentForm | Client | User input, forms |

**Decision Criteria**:
- **Server Component**: Data fetching, static content, SEO
- **Client Component**: Interactivity, useState/useEffect, browser APIs

### Step 5: Tech Stack Recommendation

Based on project requirements, recommend:

| Criteria | Prisma | Drizzle | Supabase |
|----------|--------|---------|----------|
| Type Safety | ★★★★★ | ★★★★★ | ★★★★☆ |
| Performance | ★★★★☆ | ★★★★★ | ★★★★☆ |
| Learning Curve | ★★★★☆ | ★★★☆☆ | ★★★★★ |
| Migrations | ★★★★★ | ★★★★☆ | ★★★★☆ |
| Real-time | ★★☆☆☆ | ★★☆☆☆ | ★★★★★ |

## Deliverables

```markdown
## Phase 2 Output

### 1. ERD
[Entity Relationship Diagram]

### 2. Database Schema
\`\`\`prisma
// Prisma schema
\`\`\`

### 3. API Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| ...    | ...      | ...         |

### 4. Zod Schemas
\`\`\`typescript
// Validation schemas
\`\`\`

### 5. Server/Client Strategy
| Component | Type | Reason |
|-----------|------|--------|
| ...       | ...  | ...    |

### 6. 다음 단계
- Ready for Phase 3: Implementation Strategy
```

## User Input

Context from Phase 1 or new feature: $ARGUMENTS

Review existing requirements and design the data architecture.
