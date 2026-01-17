---
name: init
description: Initialize a new Next.js project with best practices stack (shadcn, zod, zustand, biome, prisma, supabase, etc.)
argument-hint: "<project-name>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - TodoWrite
  - AskUserQuestion
---

# Next.js Project Initialization

Initialize a production-ready Next.js project with the following stack:

## Tech Stack

| Category | Package |
|----------|---------|
| Framework | Next.js 16 (App Router) |
| Runtime | Bun |
| UI | shadcn/ui, Tailwind CSS |
| Icons | hugeicons-react (not lucide) |
| Animation | framer-motion |
| Theme | next-themes |
| Auth | next-auth (Auth.js v5) |
| State | zustand, @tanstack/react-query |
| Forms | react-hook-form, @hookform/resolvers |
| Validation | zod |
| Database | prisma, @supabase/supabase-js |
| Linting | biome |
| Testing | vitest, playwright |
| Performance | web-vitals |
| Release | release-it |

## Project Name

$ARGUMENTS

## Initialization Steps

Execute the following steps in order:

### Step 1: Create Next.js Project

```bash
bunx create-next-app@latest <project-name> \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-bun
```

### Step 2: Navigate to Project

```bash
cd <project-name>
```

### Step 3: Install Core Dependencies

```bash
# UI & Styling
bun add class-variance-authority clsx tailwind-merge
bun add hugeicons-react
bun add framer-motion
bun add next-themes

# Auth
bun add next-auth@beta @auth/prisma-adapter

# State Management
bun add zustand
bun add @tanstack/react-query

# Forms & Validation
bun add react-hook-form @hookform/resolvers zod

# Database
bun add prisma @prisma/client @supabase/supabase-js
bun add -d prisma

# Performance
bun add web-vitals
```

### Step 4: Install Dev Dependencies

```bash
# Linting & Formatting
bun add -d @biomejs/biome

# Testing
bun add -d vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
bun add -d playwright @playwright/test

# Release
bun add -d release-it @release-it/conventional-changelog
```

### Step 5: Initialize shadcn/ui

```bash
bunx shadcn@latest init -d
```

Then edit `components.json` to use hugeicons instead of lucide:
- Change icon library configuration

### Step 6: Remove lucide-react (if exists)

```bash
bun remove lucide-react 2>/dev/null || true
```

### Step 7: Initialize Prisma

```bash
bunx prisma init
```

### Step 8: Initialize Biome

```bash
bunx @biomejs/biome init
```

### Step 9: Initialize Playwright

```bash
bunx playwright install
```

### Step 10: Create Project Structure

Create the following directory structure:

```
src/
├── app/
│   ├── (auth)/
│   │   └── layout.tsx
│   ├── (main)/
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   └── health/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   └── index.ts
│   ├── features/
│   │   └── .gitkeep
│   └── providers/
│       ├── index.tsx
│       ├── theme-provider.tsx
│       └── query-provider.tsx
├── lib/
│   ├── auth/
│   │   ├── index.ts
│   │   └── config.ts
│   ├── db/
│   │   ├── prisma.ts
│   │   └── queries/
│   │       └── .gitkeep
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── actions/
│   │   └── .gitkeep
│   ├── validations/
│   │   └── index.ts
│   └── utils/
│       ├── cn.ts
│       └── index.ts
├── hooks/
│   └── index.ts
├── stores/
│   └── index.ts
├── types/
│   └── index.ts
└── config/
    └── site.ts
tests/
├── unit/
│   └── .gitkeep
├── integration/
│   └── .gitkeep
└── e2e/
    └── .gitkeep
```

### Step 11: Create Configuration Files

#### biome.json
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noUselessFragments": "warn"
      },
      "correctness": {
        "useExhaustiveDependencies": "warn",
        "noUnusedImports": "error",
        "noUnusedVariables": "error"
      },
      "style": {
        "noNonNullAssertion": "off"
      },
      "suspicious": {
        "noExplicitAny": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always",
      "trailingCommas": "es5"
    }
  }
}
```

#### vitest.config.ts
```typescript
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}', 'tests/integration/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### .release-it.json
```json
{
  "git": {
    "commitMessage": "chore: release v${version}",
    "tagName": "v${version}"
  },
  "npm": {
    "publish": false
  },
  "github": {
    "release": true
  },
  "plugins": {
    "@release-it/conventional-changelog": {
      "preset": "angular",
      "infile": "CHANGELOG.md"
    }
  }
}
```

### Step 12: Create Core Files

#### src/lib/utils/cn.ts
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### src/lib/auth/config.ts
```typescript
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import { prisma } from '@/lib/db/prisma';

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
    Google,
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};
```

#### src/lib/auth/index.ts
```typescript
import NextAuth from 'next-auth';

import { authConfig } from './config';

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
```

#### src/app/api/auth/[...nextauth]/route.ts
```typescript
import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
```

#### src/lib/db/prisma.ts
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

#### src/lib/supabase/client.ts
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

#### src/lib/supabase/server.ts
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  );
}
```

#### src/components/providers/theme-provider.tsx
```typescript
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
```

#### src/components/providers/query-provider.tsx
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

#### src/components/providers/index.tsx
```typescript
'use client';

import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
```

#### src/app/layout.tsx
```typescript
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Providers } from '@/components/providers';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### src/app/loading.tsx
```typescript
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
```

#### src/app/error.tsx
```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
```

#### src/app/not-found.tsx
```typescript
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
      <p className="text-muted-foreground">Could not find requested resource</p>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Return Home
      </Link>
    </div>
  );
}
```

#### src/app/api/health/route.ts
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
}
```

#### src/config/site.ts
```typescript
export const siteConfig = {
  name: 'My App',
  description: 'A Next.js application',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og.png',
  links: {
    github: 'https://github.com/yourusername/yourrepo',
  },
};
```

#### src/stores/index.ts
```typescript
// Export your Zustand stores here
// Example:
// export { useUIStore } from './ui-store';
```

#### src/hooks/index.ts
```typescript
// Export your custom hooks here
// Example:
// export { useDebounce } from './use-debounce';
```

#### src/types/index.ts
```typescript
// Export your TypeScript types here
// Example:
// export type { User, Post } from './models';
```

#### src/lib/validations/index.ts
```typescript
import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});
```

#### tests/setup.ts
```typescript
import '@testing-library/jest-dom';
```

#### .gitignore
```
# Dependencies
node_modules
.pnp
.pnp.js
.yarn/install-state.gz

# Testing
coverage
.nyc_output
playwright-report
playwright/.cache
test-results

# Next.js
.next
out
build
.swc

# Bun
bun.lockb

# Production
dist

# Misc
.DS_Store
*.pem
Thumbs.db

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# Prisma
prisma/*.db
prisma/*.db-journal

# IDE
.idea
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
*.swp
*.swo
*~

# Turbo
.turbo

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Sentry
.sentryclirc

# Release
CHANGELOG.md
```

#### .env.example
```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

# Auth (Next-Auth)
AUTH_SECRET="your-auth-secret-generate-with-openssl-rand-base64-32"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 13: Update package.json Scripts

Add/update the following scripts in package.json:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "biome lint ./src",
    "lint:fix": "biome lint --write ./src",
    "format": "biome format --write ./src",
    "check": "biome check --write ./src",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "release": "release-it"
  }
}
```

### Step 14: Install Supabase SSR Package

```bash
bun add @supabase/ssr
```

### Step 15: Final Verification

- Run `bun run lint` to verify biome is working
- Run `bun run dev` to start the development server
- Verify the project starts without errors

## Execution Instructions

1. Create a todo list to track each step
2. Execute commands sequentially
3. Create all files with proper content
4. Handle errors gracefully
5. Report completion status

If the user provides a project name, use it. Otherwise, ask for the project name before proceeding.
