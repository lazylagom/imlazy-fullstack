---
name: phase3
description: "Phase 3: Next.js Implementation Strategy (구현 전략 수립)"
argument-hint: "[feature-context]"
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - TodoWrite
  - AskUserQuestion
---

# Phase 3: Next.js Implementation Strategy

You are a Senior Next.js Architect. Apply modern Next.js patterns to create an optimal implementation strategy.

## Objectives

1. **Directory Structure 설계** - App Router 기반 최적 구조
2. **State Management 전략** - 상태 관리 패턴 결정
3. **Data Fetching 패턴** - Server Actions, Suspense 활용

## Process

### Step 1: Directory Structure (App Router)

Design the project structure:

```
project/
├── app/
│   ├── (auth)/                    # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx             # Auth-specific layout
│   │
│   ├── (main)/                    # Main app route group
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx             # Sidebar layout
│   │
│   ├── api/                       # API routes (if needed)
│   │   └── [...]/route.ts
│   │
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── loading.tsx                # Global loading
│   ├── error.tsx                  # Global error
│   └── not-found.tsx              # 404 page
│
├── components/
│   ├── ui/                        # Reusable UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── index.ts               # Barrel export
│   │
│   └── features/                  # Feature-specific components
│       ├── auth/
│       │   ├── login-form.tsx
│       │   └── register-form.tsx
│       └── dashboard/
│           └── stats-card.tsx
│
├── lib/
│   ├── db/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   └── queries/               # Database queries
│   │       └── users.ts
│   │
│   ├── actions/                   # Server Actions
│   │   ├── auth.ts
│   │   └── posts.ts
│   │
│   ├── validations/               # Zod schemas
│   │   └── auth.ts
│   │
│   └── utils/                     # Utility functions
│       ├── cn.ts                  # classnames helper
│       └── format.ts
│
├── hooks/                         # Custom React hooks
│   ├── use-auth.ts
│   └── use-debounce.ts
│
├── stores/                        # Zustand stores
│   └── use-ui-store.ts
│
├── types/                         # TypeScript types
│   └── index.ts
│
└── config/                        # Configuration
    └── site.ts
```

### Step 2: State Management Strategy

| State Type | Solution | Use Case |
|------------|----------|----------|
| **Server State** | React Query / SWR | API 데이터 캐싱, 동기화 |
| **Client State** | Zustand | UI 상태, 모달, 사이드바 |
| **Form State** | React Hook Form | 폼 입력, 유효성 검사 |
| **URL State** | nuqs / searchParams | 필터, 정렬, 페이지네이션 |

**Zustand Store Example**:
```typescript
// stores/use-ui-store.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
```

### Step 3: Data Fetching Patterns

**Server Actions (Mutations)**:
```typescript
// lib/actions/posts.ts
'use server';

import { revalidatePath } from 'next/cache';
import { CreatePostSchema } from '@/lib/validations/posts';

export async function createPost(formData: FormData) {
  const parsed = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  await db.post.create({ data: parsed.data });
  revalidatePath('/posts');
}
```

**Suspense with Loading States**:
```typescript
// app/posts/page.tsx
import { Suspense } from 'react';
import { PostList } from '@/components/features/posts/post-list';
import { PostListSkeleton } from '@/components/features/posts/post-list-skeleton';

export default function PostsPage() {
  return (
    <Suspense fallback={<PostListSkeleton />}>
      <PostList />
    </Suspense>
  );
}
```

**Streaming with Loading UI**:
```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards />
      </Suspense>
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}
```

### Step 4: Performance Optimization

1. **Image Optimization**
   ```tsx
   import Image from 'next/image';

   <Image
     src="/hero.jpg"
     alt="Hero"
     width={1200}
     height={600}
     priority  // Above the fold
     placeholder="blur"
   />
   ```

2. **Route Segment Config**
   ```typescript
   // app/posts/[id]/page.tsx
   export const dynamic = 'force-static';
   export const revalidate = 3600; // ISR: 1 hour
   ```

3. **Parallel Data Fetching**
   ```typescript
   // Parallel fetch (good)
   const [user, posts] = await Promise.all([
     getUser(id),
     getPosts(id),
   ]);
   ```

## Deliverables

```markdown
## Phase 3 Output

### 1. Directory Structure
\`\`\`
[Project tree]
\`\`\`

### 2. State Management
| Type | Solution | Files |
|------|----------|-------|
| ...  | ...      | ...   |

### 3. Data Fetching Patterns
- Server Actions: [list]
- Suspense boundaries: [list]

### 4. Performance Considerations
- [List optimizations]

### 5. 다음 단계
- Ready for Phase 4: Implementation
```

## User Input

Context from previous phases: $ARGUMENTS

Design the implementation strategy based on requirements.
