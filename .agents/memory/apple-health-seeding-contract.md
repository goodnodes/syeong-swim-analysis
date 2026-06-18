---
name: Apple Health seeding contract (api-dev.syeong.com)
description: Non-obvious mandatory fields & formats the Syeong server enforces on POST /v2/records/apple-health, found by trial.
---

The Syeong dev server (`https://api-dev.syeong.com`) CORS allows `*` + Authorization header, so the browser can call it directly — no proxy needed for the seeding feature.

Login: `POST /auth` body `{pnum, pwd}` → `{accessToken}` (JWT in body).
Seed: `POST /v2/records/apple-health` (Bearer) body `{items:[applehealth.Payload], syncContext:{distanceUnit:"METER", timezone:"Asia/Seoul", backfill}}`.

The endpoint returns HTTP 200 even on per-item parse failures — success is `data.created.count > 0`; failures appear in `data.errors[].message`. Always inspect the body, not just the status.

Mandatory/format rules the swagger does NOT make obvious (discovered by iterating against the live server):
- **Every QuantitySample** (heartRateSamples, strokeCountSamples, …) MUST include `device` AND `sourceRevision`. Omitting `device` → `missing mandatory field: heartRateSamples[0].device`.
- `sourceRevision.operatingSystemVersion` must be a **string** (e.g. `"10.3.0"`), NOT an object — sending an object → typed decode failure.
- All timestamps must be **ISO-8601 with a colon in the offset**: `2026-06-11T14:59:00.000+09:00`. The compact `+0900` form is rejected as "expected ISO-8601 timestamp".

**Why:** these three caused successive parse_failed errors before a record was accepted; none are spelled out in swagger field descriptions.
