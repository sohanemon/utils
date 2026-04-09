# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build (ESM + CJS + types via tsdown)
bun run build

# Watch mode
bun run dev

# Run tests (watch)
bun run test

# Run tests once (silent)
bun run test:run

# Run a single test file
bun run test -- tests/functions/utils.test.ts

# Lint + format check
bun run check

# Auto-fix lint/format errors
bun run fix

# Type check
bun run typecheck

# Release (typecheck + build + publish)
bun run release
```

## Architecture

This is a published npm package (`@sohanemon/utils`) that re-exports utilities across three entry points:

| Entry | Source | Export |
|---|---|---|
| `@sohanemon/utils` | `src/index.ts` | Re-exports `@ts-utilities/core` + `src/functions/` |
| `@sohanemon/utils/hooks` | `src/hooks/index.tsx` | React hooks (`'use client'`) |
| `@sohanemon/utils/components` | `src/components/index.tsx` | React components |

### Source layout

- **`src/functions/`** — pure TS utilities (no React): `utils.ts` (cn, deepmerge, poll, shield, debounce, throttle, etc.), `cookie.ts`, `worker.ts` (workerize)
- **`src/hooks/`** — React hooks: `media-query.tsx`, `async.tsx`, `action.tsx`, `schedule.tsx`, `scroll-tracker.tsx`, `worker.tsx`, plus inline hooks in `index.tsx` (useLocalStorage, useSessionStorage, useUrlParams, useDebounce, useIntersection, useDomCalculation, etc.)
- **`src/components/`** — React components: `html-injector.tsx`, `media-wrapper.tsx`, `responsive-indicator.tsx`, `scrollable-marker.tsx`, `scroll-tracker.tsx`
- **`src/index.ts`** — re-exports `@ts-utilities/core` (types, type guards, primitives) and `./functions`

### Build

`tsdown` builds dual ESM/CJS output with `.d.ts` declarations and tree-shaking enabled. The three entry points produce separate bundles, so consumers can import only what they need.

### Testing

Vitest with jsdom environment. Test files mirror the `src/` structure under `tests/`. The setup file (`tests/setup.ts`) mocks `matchMedia`, `Worker`, `Blob`, and `URL.createObjectURL`.

### Linting / Formatting

Biome is the single tool for both lint and format. Config is in `biome.json`. Linting is currently disabled (`"linter": { "enabled": false }`), so `bun run check` / `bun run fix` only format. Single quotes for JS, double quotes for JSX.

### Peer dependencies

React, `clsx`, `tailwind-merge`, `@iconify/react`, and `@radix-ui/react-slot` are peers — they must be installed by the consumer and are not bundled.
