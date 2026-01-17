# imlazy-fullstack

> Senior Full-stack Agent System for Next.js (App Router) Development
> Next.js(App Router), React, Tailwind CSS, 효율적인 DB 설계를 전문으로 하는 시니어 개발 에이전트

## Features

This plugin provides a structured 4-phase workflow to transform ideas into production-ready Next.js applications:

### 📋 Phase-based Workflow

| Phase | Goal | Output |
|-------|------|--------|
| **Phase 1** | UX/UI & Requirement Analysis | 기능 명세서, User Journey, UI 컴포넌트 구조 |
| **Phase 2** | Schema & Architecture Design | ERD, API Routes, Server/Client 전략 |
| **Phase 3** | Next.js Implementation Strategy | Directory Structure, State Management |
| **Phase 4** | Implementation & Iteration | Clean Code, Test Cases |

### ⚡ Guiding Principles

1. **Simplicity over Complexity** - Next.js 내장 기능 우선 활용
2. **Performance First** - Image Optimization, Streaming, PPR
3. **Type Safety** - TypeScript + Zod 런타임 검증
4. **Consistency** - Tailwind CSS, 네이밍 규칙 준수

## Commands

| Command | Description |
|---------|-------------|
| `/imlazy-fullstack:develop` | Run complete 4-phase workflow |
| `/imlazy-fullstack:phase1` | UX/UI & Requirement Analysis |
| `/imlazy-fullstack:phase2` | Schema & Architecture Design |
| `/imlazy-fullstack:phase3` | Next.js Implementation Strategy |
| `/imlazy-fullstack:phase4` | Implementation & Iteration |

## Agents (Auto-triggered)

| Agent | Trigger | Action |
|-------|---------|--------|
| `schema-validator` | Prisma/Drizzle 파일 변경 | 스키마 검증 및 최적화 제안 |
| `component-analyzer` | 컴포넌트 파일 생성/수정 | Server/Client 분류 제안 |
| `performance-checker` | 코드 작성 완료 | 성능 최적화 포인트 제안 |

## Skills

- **nextjs-patterns** - App Router, Server/Client Components
- **schema-design** - Prisma/Drizzle ERD 패턴
- **ui-components** - React + Tailwind 컴포넌트
- **type-safety** - TypeScript + Zod 검증

## Installation

```bash
# Copy to Claude plugins directory
cp -r imlazy-fullstack ~/.claude/plugins/

# Or use with --plugin-dir flag
claude --plugin-dir /path/to/imlazy-fullstack
```

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma / Drizzle / Supabase
- **State**: Zustand / React Query
- **Validation**: Zod

## License

MIT
# imlazy-fullstack
