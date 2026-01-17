---
name: Next.js Patterns
description: This skill provides Next.js App Router patterns and Server/Client component strategies. Use when the user asks about "App Router structure", "Server Components vs Client Components", "route groups", "parallel routes", "intercepting routes", "Next.js 14/15 patterns", or "Server/Client 구분".
version: 1.0.0
---

# Next.js App Router Patterns

## Server Components (Default)

Server Components are the default in App Router. Use them for:

- **Data fetching**: Direct database access, API calls
- **Heavy dependencies**: Markdown rendering, syntax highlighting
- **Sensitive data**: API keys, tokens (never exposed to client)
- **SEO content**: Metadata, structured data

```typescript
// app/posts/[id]/page.tsx - Server Component (기본)
import { db } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });

  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

## Client Components

Add `'use client'` directive only when needed:

- **Interactivity**: onClick, onChange, onSubmit
- **State**: useState, useReducer
- **Effects**: useEffect, useLayoutEffect
- **Browser APIs**: localStorage, geolocation

```typescript
// components/features/posts/like-button.tsx
'use client';

import { useState, useTransition } from 'react';
import { likePost } from '@/lib/actions/posts';

export function LikeButton({ postId, initialLikes }: Props) {
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    startTransition(async () => {
      const newLikes = await likePost(postId);
      setLikes(newLikes);
    });
  };

  return (
    <button onClick={handleLike} disabled={isPending}>
      ❤️ {likes}
    </button>
  );
}
```

## Route Groups

Organize routes without affecting URL structure:

```
app/
├── (auth)/           # /login, /register (별도 레이아웃)
│   ├── login/
│   ├── register/
│   └── layout.tsx    # Auth 전용 레이아웃
│
├── (main)/           # /dashboard, /settings (사이드바 레이아웃)
│   ├── dashboard/
│   ├── settings/
│   └── layout.tsx    # 사이드바 포함 레이아웃
│
└── layout.tsx        # 루트 레이아웃
```

## Parallel Routes

Render multiple pages simultaneously with `@folder` slots:

```
app/
├── @modal/           # 모달 슬롯
│   ├── default.tsx   # 기본 (null 반환)
│   └── (.)post/[id]/ # /post/[id] 인터셉트 시 모달로 표시
│       └── page.tsx
│
├── @sidebar/         # 사이드바 슬롯
│   └── default.tsx
│
└── layout.tsx        # 슬롯 렌더링
```

```typescript
// app/layout.tsx
export default function Layout({
  children,
  modal,
  sidebar,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="flex">
      {sidebar}
      <main className="flex-1">{children}</main>
      {modal}
    </div>
  );
}
```

## Intercepting Routes

Intercept navigation to show content in a different context:

| Convention | Description |
|------------|-------------|
| `(.)` | 같은 레벨 |
| `(..)` | 한 레벨 위 |
| `(..)(..)` | 두 레벨 위 |
| `(...)` | 루트 app 디렉토리 |

```
app/
├── feed/
│   └── page.tsx          # 피드 목록
│
├── photo/[id]/
│   └── page.tsx          # 직접 접근: 전체 페이지
│
└── @modal/
    └── (.)photo/[id]/    # 피드에서 클릭: 모달로 표시
        └── page.tsx
```

## Data Fetching Patterns

### Sequential Fetching (Waterfall)

```typescript
// 순차 실행 - 느림 ❌
const user = await getUser(id);
const posts = await getPosts(user.id); // user 완료 후 실행
```

### Parallel Fetching

```typescript
// 병렬 실행 - 빠름 ✅
const [user, posts, comments] = await Promise.all([
  getUser(id),
  getPosts(id),
  getComments(id),
]);
```

### Streaming with Suspense

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* 독립적으로 스트리밍 */}
      <Suspense fallback={<CardSkeleton />}>
        <RevenueCard />
      </Suspense>
      <Suspense fallback={<CardSkeleton />}>
        <UsersCard />
      </Suspense>
      <Suspense fallback={<CardSkeleton />}>
        <OrdersCard />
      </Suspense>
    </div>
  );
}
```

## Caching Strategy

| Method | Cache | Revalidation |
|--------|-------|--------------|
| `fetch()` | Cached by default | `revalidate` option |
| `unstable_cache()` | Tag-based caching | `revalidateTag()` |
| Route Segment | Static/Dynamic | `export const dynamic` |

```typescript
// ISR: 1시간마다 재검증
export const revalidate = 3600;

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

// 정적 생성 강제
export const dynamic = 'force-static';
```

## Error Handling

```typescript
// app/posts/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-4 text-center">
      <h2>문제가 발생했습니다</h2>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

## References

See `examples/` directory for complete working examples:
- `examples/route-groups.tsx` - Route group patterns
- `examples/parallel-routes.tsx` - Parallel route implementation
- `examples/data-fetching.tsx` - Data fetching patterns
