# Syeong · 수영 실력 분석

모바일 화면 기준의 **수영 실력 분석** 웹앱. 스스로의 진척도를 추적하고 다른 사람들과 비교한다(전국 백분위, 또래 리더보드, 급수 분포). 한국어 UI.

현재는 **프론트엔드 + 목 데이터** 단계이며, 서버는 별도로 개발한다. 화면이 소비할 서버 응답 계약(DTO)은 코드와 문서로 정의돼 있다.

---

## 빠른 시작

```bash
pnpm install

# 앱 실행 (워크플로우로 구동됨, 포트는 환경이 주입)
pnpm --filter @workspace/syeong run dev

# 타입체크 / 빌드
pnpm --filter @workspace/syeong run typecheck
pnpm run typecheck      # 전체 패키지
pnpm run build          # 전체 빌드
```

> 워크스페이스 루트에서 `pnpm dev`를 직접 돌리지 말 것. 앱은 Replit 워크플로우로 구동되며 포트 등 환경변수를 워크플로우가 주입한다.

---

## 스택

- pnpm 워크스페이스(모노레포), Node.js 24, TypeScript 5.9
- 프론트: React + Vite (`artifacts/syeong`)
- API(예정): Express 5 + PostgreSQL + Drizzle ORM
- 검증: Zod (`zod/v4`), API 코드젠: Orval(OpenAPI)

---

## 모노레포 구조

```
artifacts/
  syeong/          # 수영 분석 웹앱 (slug: syeong, 경로 /)
  api-server/      # API 서버 (예정)
  mockup-sandbox/  # 컴포넌트 프리뷰
lib/               # 공유 라이브러리
scripts/           # 유틸 스크립트
```

### 앱 주요 위치 (`artifacts/syeong/src`)

- `pages/` — Home, Analysis, Compare, Measure, Profile, Result 화면 (wouter 라우트)
- `components/Layout.tsx` — 중앙 정렬 모바일 프레임 + 하단 탭(홈/분석/비교/측정/프로필/시딩)
- `components/Logo.tsx` — 브랜드 로고
- `data/mock.ts` — 모든 목 데이터의 단일 출처
- `class/engine.ts` — 셩 클래스 급수 분류 엔진 (분류·밴드·승급 진척도 계산)
- `class/dto.ts` — **서버 응답 계약(DTO)** + 어댑터
- `theme/tokens.ts` — 브랜드 컬러/그라데이션 토큰

---

## 셩 클래스 (급수 분석)

핵심 기능. **서버는 "측정된 사실값"만 내려주고, 급수 분류·밴드·진척도·카피는 전부 앱이 계산한다.**

- 분류 엔진: `artifacts/syeong/src/class/engine.ts`
- 응답 계약: `artifacts/syeong/src/class/dto.ts`
- **서버 응답 명세서: [`artifacts/syeong/docs/class-evaluation-api.md`](artifacts/syeong/docs/class-evaluation-api.md)** ← 서버 구현 시 이 문서 기준

급수: 기초 → 초급 → 중급 → 상급 → 고급 → 연수 → 마스터즈
영법: 자유형 / 배영 / 평영 / 접영

---

## 컨벤션

- UI에 이모지 금지 (아이콘은 `lucide-react` 사용)
- 모바일-인-데스크탑: ~430px 고정폭 모바일 프레임을 화면 중앙에 렌더
- 첨부 이미지는 `@assets/` 별칭으로 import (정적 경로 `attached_assets/` URL 사용 금지)
- 서버 코드에서 `console.log` 금지 (`req.log` / `logger` 사용)

자세한 워크스페이스 규칙은 `replit.md` 및 `pnpm-workspace` 가이드 참고.
