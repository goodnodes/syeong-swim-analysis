---
name: Syeong project context
description: Key facts about the Syeong swimming-analysis app and its GitHub design-data dependency
---

# Syeong (수영 실력 분석)

Mobile-view swimming-skill analytics web app. Lives in `artifacts/syeong` (react-vite, slug `syeong`, served at `/`). Frontend-only with seeded mock data in `src/data/mock.ts` — no backend/DB/OpenAPI wired up yet. Korean UI, no emojis (use lucide-react icons).

## Blocked design-data repo
- The intended design-token source `github.com/goodnodes/syeong_design_data` returns **403** via the GitHub connector due to **org OAuth App access restrictions**.
- **Why:** The `goodnodes` org must approve the OAuth app for that private repo; user attempted approval but access stayed blocked.
- **How to apply:** Don't burn time retrying the GitHub fetch unless the user confirms the org granted access. Design was built from the attached reference screenshots in `attached_assets/` instead.

## Determinism gotcha
- Any mock-data generator (e.g. `generateHeatmapData`) must use a **seeded PRNG**, not `Math.random()`, so charts/heatmaps stay stable across reloads. Already fixed with a mulberry32 seed.
