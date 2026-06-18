---
name: Syeong project context
description: Key facts about the Syeong swimming-analysis app, GitHub access via PAT, and design-token porting
---

# Syeong (수영 실력 분석)

Mobile-view swimming-skill analytics web app. Lives in `artifacts/syeong` (react-vite, slug `syeong`, served at `/`). Frontend-only with seeded mock data in `src/data/mock.ts` — no backend/DB/OpenAPI wired up yet. Korean UI, no emojis (use lucide-react icons).

## GitHub access (resolved via PAT)
- Org OAuth App access blocks the GitHub *connector* for `goodnodes` private repos (403). Bypass: a user-provided classic PAT stored as secret `GITHUB_PAT`.
- **Quirk:** `GITHUB_PAT` is present in the **bash** env but NOT in the `code_execution` sandbox — do all git/GitHub-API work from bash.
- **How to apply:** For pushing the project, use a Node script run from bash that calls the GitHub Git Data API (blobs/tree/commit/ref) with `Authorization: Bearer $GITHUB_PAT`. Avoids touching local git. Repos: design source `goodnodes/syeong_design_data`; destination `goodnodes/syeong-swim-analysis` (branch `main`).
- **Rate-limit gotcha:** Creating a blob per file trips GitHub's *secondary* rate limit (403). Instead put text files inline as tree entries (`{path,mode,type:"blob",content}`) and only create blobs for binaries; add backoff/retry. ~208 files → 13 binary blobs + 1 tree + 1 commit.

## Design tokens are React-Native, port to web
- `syeong_design_data` is a **React Native** design system (peerDeps react-native) — components can't be used directly in the web app; only **tokens** were ported.
- Web token module lives at `artifacts/syeong/src/theme/tokens.ts` (gradients, per-stroke signal colors, shadows, radius/space). shadcn HSL CSS vars in `src/index.css` carry the semantic palette; font is **Pretendard** (CDN in `index.html`).
- Brand truths: main blue Blue500 #2684FC, brandStrong Blue600 #0067EB, Blue100 #CBE2FF; stroke colors 접영#2684FC/배영#FFA800/평영#AECEFF/자유형#22D081/기타#8B95A1.

## Determinism gotcha
- Any mock-data generator (e.g. `generateHeatmapData`) must use a **seeded PRNG**, not `Math.random()`, so charts/heatmaps stay stable across reloads. Already fixed with a mulberry32 seed.
