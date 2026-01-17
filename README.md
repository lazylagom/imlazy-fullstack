# imlazy-fullstack

> Senior Full-stack Agent System for Next.js (App Router) Development
> A senior development agent specializing in Next.js (App Router), React, Tailwind CSS, and efficient database design

## Features

This plugin provides a structured 4-phase workflow to transform ideas into production-ready Next.js applications:

### Phase-based Workflow

| Phase | Goal | Output |
|-------|------|--------|
| **Phase 1** | UX/UI & Requirement Analysis | Feature Specification, User Journey, UI Component Structure |
| **Phase 2** | Schema & Architecture Design | ERD, API Routes, Server/Client Strategy |
| **Phase 3** | Next.js Implementation Strategy | Directory Structure, State Management |
| **Phase 4** | Implementation & Iteration | Clean Code, Test Cases |

### Guiding Principles

1. **Simplicity over Complexity** - Prioritize Next.js built-in features
2. **Performance First** - Image Optimization, Streaming, PPR
3. **Type Safety** - TypeScript + Zod runtime validation
4. **Consistency** - Tailwind CSS, strict naming conventions

## Commands

| Command | Description |
|---------|-------------|
| `/imlazy-fullstack:init` | Initialize new Next.js project with full stack |
| `/imlazy-fullstack:develop` | Run complete 4-phase workflow |
| `/imlazy-fullstack:phase1` | UX/UI & Requirement Analysis |
| `/imlazy-fullstack:phase2` | Schema & Architecture Design |
| `/imlazy-fullstack:phase3` | Next.js Implementation Strategy |
| `/imlazy-fullstack:phase4` | Implementation & Iteration |

## Agents (Auto-triggered)

| Agent | Trigger | Action |
|-------|---------|--------|
| `schema-validator` | Prisma/Drizzle file changes | Schema validation and optimization suggestions |
| `component-analyzer` | Component file creation/modification | Server/Client classification suggestions |
| `performance-checker` | Code implementation complete | Performance optimization recommendations |

## Skills

- **nextjs-patterns** - App Router, Server/Client Components
- **schema-design** - Prisma/Drizzle ERD patterns
- **ui-components** - React + Tailwind components
- **type-safety** - TypeScript + Zod validation

## Installation

### Via Marketplace (Recommended)

1. Start Claude Code and add the marketplace:

```
/marketplace add https://github.com/lazylagom/lazy-marketplace
```

2. Install the plugin:

```
/plugin install imlazy-fullstack
```

### Manual Installation

```bash
# Clone directly to Claude plugins directory
git clone https://github.com/lazylagom/imlazy-fullstack.git ~/.claude/plugins/imlazy-fullstack

# Or use with --plugin-dir flag
claude --plugin-dir /path/to/imlazy-fullstack
```

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Runtime**: Bun
- **Language**: TypeScript
- **UI**: shadcn/ui, Tailwind CSS
- **Icons**: hugeicons-react
- **Animation**: framer-motion
- **Theme**: next-themes
- **Auth**: next-auth (Auth.js v5)
- **State**: Zustand, @tanstack/react-query
- **Forms**: react-hook-form, @hookform/resolvers
- **Validation**: Zod
- **Database**: Prisma, Supabase
- **Linting**: Biome
- **Testing**: Vitest, Playwright
- **Performance**: web-vitals
- **Release**: release-it

## License

MIT
