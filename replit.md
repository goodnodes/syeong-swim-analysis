# Syeong · 수영 실력 분석

A mobile-view swimming-skill analytics web app where a swimmer tracks their own progress and compares themselves against other people (national percentile, peer leaderboard, level distribution). Korean-language UI. Frontend-only with seeded mock data — no backend yet.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/syeong/` — the swimming-analysis web app (react-vite, slug `syeong`, served at `/`)
  - `src/pages/` — Home, Analysis, Compare, Measure, Profile screens (wouter routes)
  - `src/components/Layout.tsx` — centered mobile frame + bottom tab nav (홈/분석/비교/측정/프로필)
  - `src/data/mock.ts` — single source of truth for all seeded mock data (user, peers, sessions, level system)
  - `src/index.css` — theme tokens (water/aqua blue palette)
- Visual reference screenshots live in `attached_assets/` (imported via `@assets` alias)

## Architecture decisions

- Frontend-only mockup: all data is seeded in `src/data/mock.ts`; there is no API/DB wired up yet. When the real API arrives, replace mock imports with generated hooks.
- Mobile-in-desktop: the app renders a fixed ~430px-wide mobile frame centered on the page; all screens scroll inside it.
- Level system (실력 등급), in order: 기초(신기초·기초1) → 초급(초급1~3) → 중급(중급1~3) → 상급(상급1~3) → 고급 → 연수. Strokes: 자유형/배영/평영/접영.
- No emojis anywhere in the UI (use lucide-react icons instead).

## Product

A swimmer opens Syeong on their phone and sees, at a glance, their current skill level and where they rank nationally (상위 X%). Five screens: a Home dashboard (level, percentile, distance, sessions, recent sessions), Analysis (period/stroke/level tabs with line & area charts plus a yearly contribution heatmap), Compare (national percentile hero, population distribution, peer leaderboard), Measure (animated skill-measurement flow ending in a result card), and Profile (stats, history, badges, settings).

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
