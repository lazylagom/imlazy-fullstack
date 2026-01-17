# imlazy-develop

Next.js 4-phase development workflow plugin with auto-validation agents.

## Overview

This plugin provides a structured 4-phase workflow for developing features in Next.js App Router projects. It guides you through requirement analysis, schema design, implementation strategy, and code generation.

## Plugin Structure

```
imlazy-develop/
├── .claude-plugin/plugin.json    # Plugin manifest
├── commands/                     # Slash commands (/develop, /phase1-4)
├── skills/                       # Reference documentation
│   ├── nextjs-patterns/         # App Router, Server/Client components
│   ├── schema-design/           # Prisma/Drizzle patterns
│   ├── ui-components/           # React + Tailwind patterns
│   └── type-safety/             # TypeScript + Zod patterns
├── agents/                       # Auto-triggered validation agents
│   ├── schema-validator.md      # Validates Prisma/Drizzle schemas
│   ├── component-analyzer.md    # Server/Client component classification
│   └── performance-checker.md   # Performance optimization suggestions
└── hooks/hooks.json             # PostToolUse hooks for auto-triggering agents
```

## Commands

| Command | Purpose |
|---------|---------|
| `/imlazy-develop:develop` | Run complete 4-phase workflow |
| `/imlazy-develop:phase1` | UX/UI & Requirement Analysis |
| `/imlazy-develop:phase2` | Schema & Architecture Design |
| `/imlazy-develop:phase3` | Next.js Implementation Strategy |
| `/imlazy-develop:phase4` | Implementation & Iteration |

## 4-Phase Workflow

1. **Phase 1**: Requirement clarification, user journey mapping, UI component structure
2. **Phase 2**: ERD design, Prisma/Drizzle schema, API routes, Server/Client strategy
3. **Phase 3**: Directory structure, state management (Zustand/React Query), data fetching patterns
4. **Phase 4**: Code generation following strict patterns, testing

## Guiding Principles

These principles apply to all generated code:

1. **Simplicity over Complexity**: Use Next.js built-in features first, minimize external libraries
2. **Performance First**: Server Components by default, `'use client'` only when necessary
3. **Type Safety**: Strict TypeScript, Zod for runtime validation, no `any` types
4. **Consistency**: Tailwind CSS, kebab-case files, camelCase variables, PascalCase components

## Code Patterns

### Server Components (Default)
- Data fetching, database access, SEO content
- Keep heavy dependencies server-side

### Client Components (`'use client'`)
- Required only for: useState, useEffect, event handlers, browser APIs
- Extract interactive parts to minimal Client Components

### Server Actions
```typescript
'use server';
// Always validate with Zod before database operations
const parsed = Schema.safeParse(formData);
if (!parsed.success) return { error: parsed.error.flatten() };
```

### File Naming
- Components: `kebab-case.tsx` (e.g., `post-card.tsx`)
- Schemas: `lib/validations/*.ts`
- Actions: `lib/actions/*.ts`
- DB queries: `lib/db/queries/*.ts`

## Auto-Triggered Agents

The plugin includes hooks that automatically trigger agents after file edits:

- **schema-validator**: Runs on `*.prisma` or Drizzle schema edits
- **component-analyzer**: Runs on `.tsx` component edits
- **performance-checker**: Runs on page/route completion

## Tech Stack Defaults

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS with `cn()` utility (clsx + tailwind-merge)
- **Database**: Prisma or Drizzle ORM
- **Validation**: Zod schemas
- **State**: Zustand (client), React Query (server)
- **Forms**: React Hook Form with zodResolver

## Related Plugins

- **imlazy-init**: Project initialization and scaffolding (use this first for new projects)
