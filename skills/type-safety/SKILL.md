---
name: Type Safety
description: This skill provides TypeScript and Zod patterns for type-safe Next.js applications. Use when the user asks about "TypeScript", "Zod validation", "type safety", "runtime validation", "타입 안전성", "스키마 검증", "API validation", or "form validation".
version: 1.0.0
---

# TypeScript + Zod Type Safety Patterns

## TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Zod Schema Patterns

### Basic Schemas

```typescript
// lib/validations/common.ts
import { z } from 'zod';

// Reusable schemas
export const emailSchema = z.string().email('유효한 이메일을 입력하세요');

export const passwordSchema = z.string()
  .min(8, '비밀번호는 8자 이상이어야 합니다')
  .regex(/[A-Z]/, '대문자를 포함해야 합니다')
  .regex(/[0-9]/, '숫자를 포함해야 합니다');

export const slugSchema = z.string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, '소문자, 숫자, 하이픈만 허용');

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});
```

### Entity Schemas

```typescript
// lib/validations/user.ts
import { z } from 'zod';
import { emailSchema, passwordSchema } from './common';

export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, '이름은 2자 이상이어야 합니다').max(50),
});

export const updateUserSchema = createUserSchema.partial().omit({
  password: true,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력하세요'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});

// Type inference
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

### API Response Schemas

```typescript
// lib/validations/api.ts
import { z } from 'zod';

// Generic API response wrapper
export function createApiResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
  });
}

export function createApiErrorSchema() {
  return z.object({
    success: z.literal(false),
    error: z.object({
      code: z.string(),
      message: z.string(),
    }),
  });
}

// Usage
const userResponseSchema = createApiResponseSchema(
  z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
  })
);
```

## Server Action Validation

```typescript
// lib/actions/posts.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth';

const CreatePostSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요').max(100),
  content: z.string().min(10, '내용은 10자 이상이어야 합니다'),
  slug: z.string().regex(/^[a-z0-9-]+$/, '소문자, 숫자, 하이픈만 허용'),
});

export type ActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createPost(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  // 1. Authentication check
  const user = await getCurrentUser();
  if (!user) {
    return { error: '로그인이 필요합니다' };
  }

  // 2. Parse and validate input
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    slug: formData.get('slug'),
  };

  const parsed = CreatePostSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // 3. Check for duplicate slug
  const existing = await db.post.findUnique({
    where: { slug: parsed.data.slug },
  });

  if (existing) {
    return {
      fieldErrors: { slug: ['이미 사용 중인 슬러그입니다'] },
    };
  }

  // 4. Create post
  try {
    const post = await db.post.create({
      data: {
        ...parsed.data,
        authorId: user.id,
      },
    });

    revalidatePath('/posts');
    redirect(`/posts/${post.slug}`);
  } catch (error) {
    return { error: '게시물 생성에 실패했습니다' };
  }

  return { success: true };
}
```

## API Route Validation

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db/prisma';

const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  category: z.string().optional(),
  search: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);

  const query = QuerySchema.safeParse(searchParams);

  if (!query.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: query.error.flatten().fieldErrors,
        },
      },
      { status: 400 }
    );
  }

  const { page, limit, category, search } = query.data;

  const where = {
    ...(category && { categoryId: category }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { content: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [posts, total] = await Promise.all([
    db.post.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    db.post.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
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

## Type-safe Environment Variables

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Validate at startup
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
```

## Type Guards and Assertions

```typescript
// lib/utils/type-guards.ts

// Type guard
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// Type assertion
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

// Usage in exhaustive switch
type Status = 'pending' | 'active' | 'completed';

function getStatusLabel(status: Status): string {
  switch (status) {
    case 'pending':
      return '대기 중';
    case 'active':
      return '진행 중';
    case 'completed':
      return '완료';
    default:
      return assertNever(status); // TypeScript error if case missing
  }
}
```

## Generic Utility Types

```typescript
// types/utils.ts

// Make specific fields required
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// Make specific fields optional
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Extract non-nullable type
type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

// Async function return type
type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : never;
```

## Best Practices

1. **Validate at boundaries** - API routes, Server Actions, form submissions
2. **Use type inference** - `z.infer<typeof schema>` instead of manual types
3. **Centralize schemas** - Reuse validation logic across app
4. **Fail fast** - Validate environment variables at startup
5. **Never use `any`** - Use `unknown` and narrow with type guards

## References

See `examples/` for complete patterns:
- `examples/form-validation.tsx` - Form with Zod + React Hook Form
- `examples/api-validation.ts` - API route validation patterns
- `examples/action-validation.ts` - Server Action validation
