# imlazy-develop

> **Ship Fast, Stay Lazy**
> Transform ideas into production-ready Next.js features through a structured 4-phase workflow.

A senior full-stack development agent specialized in Next.js (App Router), React, Tailwind CSS, and efficient database design. Stop reinventing the wheel—let the agent handle the boilerplate while you focus on what matters.

## Philosophy

- **Simplicity over Complexity** — Use Next.js built-in features first, minimize external dependencies
- **Performance First** — Server Components by default, optimize images, stream everything
- **Type Safety** — TypeScript strict mode + Zod runtime validation, no `any` allowed
- **Consistency** — Tailwind CSS design system, strict naming conventions, predictable patterns

## Installation

### Via Marketplace (Recommended)

1. Start Claude Code and add the marketplace:

```
/marketplace add https://github.com/lazylagom/lazy-marketplace
```

2. Install the plugin:

```
/plugin install imlazy-develop
```

3. Verify installation:

```
/imlazy-develop:develop --help
```

### Manual Installation

```bash
git clone https://github.com/lazylagom/imlazy-develop.git ~/.claude/plugins/imlazy-develop
```

## Commands

| Command | Description |
|---------|-------------|
| `/imlazy-develop:develop <idea>` | Run complete 4-phase workflow |
| `/imlazy-develop:phase1 <idea>` | UX/UI & Requirement Analysis |
| `/imlazy-develop:phase2` | Schema & Architecture Design |
| `/imlazy-develop:phase3` | Next.js Implementation Strategy |
| `/imlazy-develop:phase4` | Implementation & Iteration |

## 4-Phase Workflow

```
+------------------------------------------------------------------+
|                                                                  |
|   IDEA                                                           |
|      |                                                           |
|      v                                                           |
|   +----------------------------------------------------------+   |
|   |  Phase 1: UX/UI & Requirement Analysis                   |   |
|   |  --------------------------------------------------------|   |
|   |  * Clarify requirements & target users                   |   |
|   |  * Create user journey map                               |   |
|   |  * Design UI component structure                         |   |
|   |                                                          |   |
|   |  Output: Feature Spec, User Journey, Component Tree      |   |
|   +----------------------------------------------------------+   |
|      |                                                           |
|      v                                                           |
|   +----------------------------------------------------------+   |
|   |  Phase 2: Schema & Architecture Design                   |   |
|   |  --------------------------------------------------------|   |
|   |  * Design ERD & data models                              |   |
|   |  * Plan API routes & Server Actions                      |   |
|   |  * Define Server/Client component strategy               |   |
|   |                                                          |   |
|   |  Output: ERD, Prisma Schema, API Design, Zod Schemas     |   |
|   +----------------------------------------------------------+   |
|      |                                                           |
|      v                                                           |
|   +----------------------------------------------------------+   |
|   |  Phase 3: Next.js Implementation Strategy                |   |
|   |  --------------------------------------------------------|   |
|   |  * Design directory structure (App Router)               |   |
|   |  * Plan state management (Zustand, React Query)          |   |
|   |  * Define data fetching patterns (Suspense, Streaming)   |   |
|   |                                                          |   |
|   |  Output: Project Structure, State Strategy, Patterns     |   |
|   +----------------------------------------------------------+   |
|      |                                                           |
|      v                                                           |
|   +----------------------------------------------------------+   |
|   |  Phase 4: Implementation & Iteration                     |   |
|   |  --------------------------------------------------------|   |
|   |  * Generate clean, production-ready code                 |   |
|   |  * Apply TypeScript + Zod validation                     |   |
|   |  * Write tests (Vitest, Playwright)                      |   |
|   |                                                          |   |
|   |  Output: Source Code, Test Cases, Documentation          |   |
|   +----------------------------------------------------------+   |
|      |                                                           |
|      v                                                           |
|   PRODUCTION-READY FEATURE                                       |
|                                                                  |
+------------------------------------------------------------------+
```

## Agents (Auto-triggered)

Agents automatically activate based on file changes to provide real-time feedback:

| Agent | Trigger | Action |
|-------|---------|--------|
| `schema-validator` | `*.prisma`, `schema.ts` changes | Validates schema, suggests indexes, checks relations |
| `component-analyzer` | `*.tsx` in `components/`, `app/` | Suggests Server/Client classification |
| `performance-checker` | Page/route implementation complete | Identifies optimization opportunities |

## Skills

Reference documentation automatically loaded when relevant:

| Skill | Topics |
|-------|--------|
| `nextjs-patterns` | App Router, Route Groups, Parallel Routes, Intercepting Routes, Server/Client Components |
| `schema-design` | Prisma/Drizzle schemas, ERD patterns, Relations, Indexes, Soft delete |
| `ui-components` | React + Tailwind patterns, CVA variants, Form components, Modal, Card |
| `type-safety` | TypeScript strict mode, Zod schemas, Type inference, Validation patterns |

## Usage Examples

### Develop a Feature

```
/imlazy-develop:develop "Build a blog platform with user authentication,
markdown posts, categories, and comments"
```

The agent will guide you through all 4 phases, asking clarifying questions and generating production-ready code.

### Run Individual Phases

```bash
# Start with requirement analysis
/imlazy-develop:phase1 "User dashboard with analytics"

# Design the database schema
/imlazy-develop:phase2

# Plan the implementation
/imlazy-develop:phase3

# Generate the code
/imlazy-develop:phase4
```

## Hooks

PostToolUse hooks automatically trigger agents for quality assurance:

| Event | File Pattern | Agent Triggered |
|-------|--------------|-----------------|
| Write/Edit | `*.prisma`, `schema*.ts` | `schema-validator` |
| Write/Edit | `*.tsx` in `components/`, `app/` | `component-analyzer` |
| Implementation Complete | `page.tsx`, `route.ts` | `performance-checker` |

## vs Traditional Workflow

| Traditional | imlazy-develop |
|-------------|----------------|
| Write boilerplate code | Agent generates patterns |
| Guess at architecture | Structured 4-phase design |
| Manual code review | Auto-triggered validation agents |
| Context switching | Unified development workflow |

## Getting Started

1. Initialize a new project first (if needed):
   ```
   /imlazy-init:init my-project
   ```

2. Start developing features:
   ```
   /imlazy-develop:develop "your feature idea"
   ```

## Related Plugins

- **imlazy-init**: Project initialization and scaffolding (use this first for new projects)

## License

MIT
