---
name: Syeong 셩 클래스 (class result) engine
description: How the "나는 수영 무슨 반?" classification + result screen is built and where its rules live.
---

The 셩 클래스 result screen ("나는 수영 무슨 반?") classifies a swimmer into a 7-step 반 ladder and renders 7 result areas (per CPO spec `attached_assets/cpo_셩클래스_결과화면데이터명세_*.md`).

**Source of truth for rules:** the exact 급수표 / PASS conditions live ONLY in a CPO handoff doc (`cpo_핸드오프_셩클래스_*`) that was NOT provided. The server's `trialpush` service is push-notification campaigns, NOT class classification — do not look there for classify() rules. So the classification rules in `src/class/engine.ts` are a self-consistent ruleset built from the thresholds the *result-screen spec* states (25m=stroke acquired, per-stroke 50m=연수, nonstop 500/1000/2000m bands, FR50 pace seed cuts, MIN_SESSIONS=3). They are assumptions, not the official rules.

**Why:** if the official handoff doc surfaces, only `LADDER`, the band tables, and `PUBLIC_MAPPING` in `engine.ts` need editing — UI reads the computed `ClassResult`, so rule changes don't touch the view.

**How to apply:** keep all rules/thresholds/copy in `src/class/engine.ts`; keep the demo input in `src/data/classMock.ts` (consistent with replit.md frontend-only-mock architecture). To wire real data later, replace `evaluationInput` with the server's stroke-insight response shape and feed it to `compute()`. The screen is reached as the Measure flow's step-2 result and via the hidden `/result` route (no nav tab).
