---
name: phase4
description: "Phase 4: Implementation & Iteration (구현 및 반복)"
argument-hint: "[feature-to-implement]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - Task
  - TodoWrite
  - AskUserQuestion
---

# Phase 4: Implementation & Iteration

You are a Senior Full-stack Developer. Generate clean, production-ready code following all previous phase outputs.

## Objectives

1. **Clean Code 생성** - 원칙을 준수하는 코드 작성
2. **Type Safety 보장** - TypeScript + Zod 완전 활용
3. **테스트 케이스 작성** - 핵심 기능 테스트

## Guiding Principles (필수 준수)

1. **Simplicity over Complexity**
   - Next.js 내장 기능 우선 사용
   - 불필요한 추상화 지양
   - 라이브러리 최소화

2. **Performance First**
   - Server Components 기본
   - 'use client' 최소화
   - Dynamic imports for heavy components

3. **Type Safety**
   - `any` 타입 사용 금지
   - Zod 스키마로 런타임 검증
   - Type inference 활용

4. **Consistency**
   - Tailwind CSS 유틸리티 클래스
   - 네이밍 규칙: camelCase (변수), PascalCase (컴포넌트)
   - 파일 네이밍: kebab-case

## Implementation Patterns

### Component Template

```typescript
// components/features/posts/post-card.tsx

interface PostCardProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    createdAt: Date;
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold">{post.title}</h3>
      <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
      <time className="mt-4 block text-sm text-muted-foreground">
        {formatDate(post.createdAt)}
      </time>
    </article>
  );
}
```

### Server Action Template

```typescript
// lib/actions/posts.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth';

const CreatePostSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요').max(100),
  content: z.string().min(10, '내용은 10자 이상이어야 합니다'),
});

export async function createPost(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: '로그인이 필요합니다' };
  }

  const parsed = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const post = await db.post.create({
    data: {
      ...parsed.data,
      authorId: user.id,
    },
  });

  revalidatePath('/posts');
  redirect(`/posts/${post.id}`);
}
```

### Form Component with useActionState

```typescript
// components/features/posts/create-post-form.tsx
'use client';

import { useActionState } from 'react';
import { createPost } from '@/lib/actions/posts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CreatePostForm() {
  const [state, action, pending] = useActionState(createPost, null);

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Input
        name="title"
        placeholder="제목"
        required
        disabled={pending}
      />

      <textarea
        name="content"
        placeholder="내용을 입력하세요..."
        className="min-h-[200px] w-full rounded-md border p-3"
        required
        disabled={pending}
      />

      <Button type="submit" disabled={pending}>
        {pending ? '저장 중...' : '게시하기'}
      </Button>
    </form>
  );
}
```

### API Route Template (if needed)

```typescript
// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db/prisma';

const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = QuerySchema.safeParse({
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
  });

  if (!query.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters' },
      { status: 400 }
    );
  }

  const { page, limit } = query.data;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    db.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    db.post.count(),
  ]);

  return NextResponse.json({
    data: posts,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
```

## Testing Patterns

### Unit Test Example

```typescript
// __tests__/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, cn } from '@/lib/utils';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('2024년 1월 15일');
  });
});

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden')).toBe('base');
  });
});
```

### Integration Test Example

```typescript
// __tests__/actions/posts.test.ts
import { describe, it, expect, vi } from 'vitest';
import { createPost } from '@/lib/actions/posts';

vi.mock('@/lib/db/prisma', () => ({
  db: {
    post: {
      create: vi.fn().mockResolvedValue({ id: '1', title: 'Test' }),
    },
  },
}));

describe('createPost', () => {
  it('creates a post successfully', async () => {
    const formData = new FormData();
    formData.set('title', 'Test Post');
    formData.set('content', 'This is test content');

    const result = await createPost(null, formData);
    // Assert redirect or success state
  });
});
```

## Execution Workflow

1. **Create TodoWrite task list** for all files to implement
2. **Implement in order**: Types → Schemas → DB → Actions → Components → Pages
3. **Test each component** as you create it
4. **Mark todos complete** progressively
5. **Run linting** after each file: `npx eslint <file>`
6. **Type check** periodically: `npx tsc --noEmit`

## User Input

Feature to implement: $ARGUMENTS

Review previous phase outputs and begin implementation. Start with the data layer (schemas, types) and work up to UI components.
