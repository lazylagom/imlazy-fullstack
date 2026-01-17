/**
 * Route Groups Example
 * 라우트 그룹 예제 - URL에 영향 없이 레이아웃 분리
 */

// ============================================
// app/(auth)/layout.tsx - 인증 페이지 전용 레이아웃
// ============================================

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        {children}
      </div>
    </div>
  );
}

// ============================================
// app/(auth)/login/page.tsx
// ============================================

import { LoginForm } from '@/components/features/auth/login-form';

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold">로그인</h1>
      <LoginForm />
    </>
  );
}

// ============================================
// app/(main)/layout.tsx - 메인 앱 레이아웃 (사이드바 포함)
// ============================================

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

// ============================================
// app/(main)/dashboard/page.tsx
// ============================================

import { Suspense } from 'react';
import { StatsCards } from '@/components/features/dashboard/stats-cards';
import { RecentActivity } from '@/components/features/dashboard/recent-activity';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">대시보드</h1>

      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-64" />}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
  );
}

// ============================================
// Directory Structure
// ============================================
/*
app/
├── (auth)/                    # 인증 라우트 그룹
│   ├── login/
│   │   └── page.tsx          # /login
│   ├── register/
│   │   └── page.tsx          # /register
│   ├── forgot-password/
│   │   └── page.tsx          # /forgot-password
│   └── layout.tsx            # 인증 전용 레이아웃 (센터 정렬)
│
├── (main)/                    # 메인 앱 라우트 그룹
│   ├── dashboard/
│   │   └── page.tsx          # /dashboard
│   ├── settings/
│   │   ├── page.tsx          # /settings
│   │   └── profile/
│   │       └── page.tsx      # /settings/profile
│   └── layout.tsx            # 사이드바 레이아웃
│
├── (marketing)/               # 마케팅 라우트 그룹
│   ├── page.tsx              # / (홈페이지)
│   ├── about/
│   │   └── page.tsx          # /about
│   ├── pricing/
│   │   └── page.tsx          # /pricing
│   └── layout.tsx            # 마케팅 레이아웃 (헤더만)
│
└── layout.tsx                # 루트 레이아웃 (공통 providers)
*/
