# 셩 클래스 결과 화면 — 서버 응답 명세 (Class Evaluation API)

> 이 문서 하나로 서버가 응답을 구현하면, 앱은 **fetch 한 줄 교체**만으로 바로 적용된다.
> 앱 측 계약 코드: `artifacts/syeong/src/class/dto.ts` (이 문서와 1:1 일치, 코드가 최종 기준).

---

## 0. 설계 원칙 (꼭 먼저 읽기)

- **서버는 "측정된 사실(facts)"만 내려준다.** 영법별 인사이트 + 세션 메타까지가 서버의 책임.
- **급수 분류 · 밴드 매핑 · 승급 진척도 · 화면 카피는 전부 앱이 계산한다.** (`engine.ts`)
- 즉 서버는 **이미 계산 중인 인사이트 값을 그대로 노출**하면 되고, 화면 규칙이 바뀌어도 서버는 안 바뀐다.
- 따라서 이 응답에는 "급수명", "밴드 라벨", "진척도 %" 같은 **계산 결과를 넣지 않는다.** (넣어도 앱은 무시함)

---

## 1. 엔드포인트

| 항목 | 값 |
|---|---|
| Method | `GET` |
| Path | `/v2/insights/class-evaluation` *(권장 — 서버 자유, 앱은 URL만 맞추면 됨)* |
| 인증 | `Authorization: Bearer <accessToken>` *(시딩/기록 API와 동일)* |
| 응답 | `200 OK` · `application/json` · 본문 = 아래 `ClassEvaluationDto` |
| 대상 | 토큰의 **본인** 평가 결과 (path/query에 userId 불필요) |

---

## 2. 응답 본문 — 전체 스키마

```jsonc
{
  "generatedAt": "2026-06-18T09:00:00+09:00",   // 응답 생성 시각 (ISO-8601)
  "period": { "from": "2026-05-20", "to": "2026-06-17" }, // 판정 기간 (세션 날짜 min~max)
  "sessionCount": 6,                             // 판정에 쓴 유효 세션 수 (이상 랩 제외 후)

  "strokes": {                                   // 4영법 "모두" 포함 (미측정도 0으로)
    "freestyle":    { "continuousMaxM": 100, "representativePace50Sec": 33, "cumulativeDistanceM": 42000, "pbPace50Sec": 31 },
    "backstroke":   { "continuousMaxM": 75,  "representativePace50Sec": 41, "cumulativeDistanceM": 12000, "pbPace50Sec": 40 },
    "breaststroke": { "continuousMaxM": 50,  "representativePace50Sec": 45, "cumulativeDistanceM": 9000,  "pbPace50Sec": 44 },
    "butterfly":    { "continuousMaxM": 15,  "representativePace50Sec": 39, "cumulativeDistanceM": 1500,  "pbPace50Sec": 38 }
  },

  "nonstop": {
    "maxDistanceM": 1500,    // 한 번에 쉬지 않고 간 최장 거리
    "maxDurationSec": 1680,  // 그 무휴식 블록의 소요 시간
    "pbDistanceM": 1500      // (선택) 역대 무휴식 최장
  },

  "previousClassKey": "intermediate"  // (선택) 직전 평가 급수 key. 첫 평가면 null/생략
}
```

---

## 3. 필드 명세 (전체)

### 3-1. 최상위

| 필드 | 타입 | 필수 | 단위 | 제약 | 앱 사용처 |
|---|---|---|---|---|---|
| `generatedAt` | string | 필수 | — | ISO-8601 | (현재 화면엔 미표시, 캐시/디버그용) |
| `period.from` | string | **필수** | — | **정확히 `YYYY-MM-DD`** | 판정 근거 "기준 기간" |
| `period.to` | string | **필수** | — | **정확히 `YYYY-MM-DD`** | 판정 근거 "기준 기간" |
| `sessionCount` | number | **필수** | 회 | 정수, ≥ 0 | 판정 근거 + 최소 3세션 충족 판정 |
| `strokes` | object | **필수** | — | 4영법 키 **모두 존재** | 영법별 진도 · 분류 |
| `nonstop` | object | **필수** | — | — | 거리·지구력 스탯, 연수 조건 |
| `previousClassKey` | string\|null | 선택 | — | `ClassKey` enum 또는 null | 승급 축하 배너 |

### 3-2. `strokes.{freestyle|backstroke|breaststroke|butterfly}` (= `StrokeFactsDto`)

| 필드 | 타입 | 필수 | 단위 | 제약 | 앱 사용처 |
|---|---|---|---|---|---|
| `continuousMaxM` | number | **필수** | m | 정수 권장, ≥ 0 | 영법 획득(25)/연수(50)/진도바, 급수 분류 |
| `representativePace50Sec` | number\|null | freestyle **사실상 필수**, 그 외 선택 | 초 | 정수 권장, > 0 | 속도 스탯(자유형) / 영법 상세 |
| `cumulativeDistanceM` | number\|null | 선택 | m | 정수, ≥ 0 | 영법바 미니(영역7, 데모 후순위) |
| `pbPace50Sec` | number\|null | 선택 | 초 | 정수, > 0 | 대표 PB(영역7, 데모 후순위) |

### 3-3. `nonstop`

| 필드 | 타입 | 필수 | 단위 | 제약 | 앱 사용처 |
|---|---|---|---|---|---|
| `maxDistanceM` | number | **필수** | m | 정수 권장, ≥ 0 | 거리 스탯, 연수 조건(≥2000) |
| `maxDurationSec` | number | **필수** | 초 | ≥ 0 | 지구력 스탯(분으로 환산해 표시) |
| `pbDistanceM` | number\|null | 선택 | m | 정수, ≥ 0 | 무휴식 최장 PB(영역7) |

---

## 4. Enum 정의

### 4-1. 영법 키 (`strokes`의 키) — 고정 4종
`freestyle`(자유형) · `backstroke`(배영) · `breaststroke`(평영) · `butterfly`(접영)
- 서버 내부 enum이 `FREE/BACK/BREAST/BUTTERFLY`라면 **이 키로 매핑**해서 내려준다.

### 4-2. `ClassKey` (`previousClassKey`에 쓰는 값) — 7단계
| key | 반 이름 | key | 반 이름 |
|---|---|---|---|
| `basic` | 기초반 | `expert` | 고급반 |
| `beginner` | 초급반 | `yeonsu` | 연수반 |
| `intermediate` | 중급반 | `masters` | 마스터즈 |
| `advanced` | 상급반 | | |

> `previousClassKey`는 서버가 **직전 평가의 분류 결과를 저장**해 두었다가 내려주는 값이다.
> (분류는 앱이 하므로, 앱이 평가 후 결과 key를 서버에 저장하는 별도 PUT/POST를 두거나,
> 데모 단계에선 생략/`null`로 둬도 된다. → 그러면 승급 배너만 안 뜬다.)

---

## 5. 제약사항 / 불변식 (반드시 지켜야 앱이 안 깨짐) ★

1. **`strokes`에는 4개 키(`freestyle`,`backstroke`,`breaststroke`,`butterfly`)가 전부 있어야 한다.**
   하나라도 없으면 앱이 런타임 에러. 측정 안 한 영법도 `{ "continuousMaxM": 0 }`로 포함.
2. **단위는 미터(m)·초(sec) 고정.** 야드 풀이라도 서버가 **미터로 환산**해 보낸다. (앱은 야드 미지원)
3. **거리·세션 수는 정수 권장.** 화면에 그대로 노출된다:
   - `continuousMaxM` → `"100m"`처럼 직접 표기 (소수면 `"75.4m"`로 보임)
   - `nonstop.maxDistanceM` → 천단위 콤마(`"1,500m"`)로 표기
4. **`period.from`/`to`는 정확히 `YYYY-MM-DD`.** 다른 포맷이면 "기준 기간" 표기가 깨진다. (`5월 20일 ~ 6월 17일`로 가공)
5. **음수 금지.** 모든 수치는 ≥ 0. 페이스는 > 0 (0이면 비정상).
6. **`representativePace50Sec`(freestyle)는 사실상 필수.** 없으면 속도 스탯이 `999초 / 입문 수준`으로 표시된다. 자유형 기록이 있으면 반드시 채울 것.
7. **계산 결과(급수명·밴드·진척도)는 넣지 않는다.** 사실값만. (넣어도 무시됨)
8. **`null`과 생략은 동일 취급** (선택 필드 한정). 필수 필드는 `null` 금지.

---

## 6. 엣지 케이스 동작 (서버는 그냥 사실값만 주면 됨)

| 상황 | 서버가 보낼 것 | 앱 화면 동작 |
|---|---|---|
| 유효 세션 < 3 | 가진 사실값 그대로 (`sessionCount` 실제값) | 결과는 보이되 판정 근거에 **"N회 더 필요"** 배지/안내 표시 |
| 기록이 전혀 없음 | 모든 `continuousMaxM:0`, `nonstop:0`, `sessionCount:0` | **기초반(기초1)** + "3회 더 필요" 준비 상태로 표시 (크래시 없음) |
| 자유형 기록만 있음 | 나머지 영법 `continuousMaxM:0`, pace 생략 | 해당 영법 "미시작", 속도 스탯은 자유형 기준 정상 |
| 첫 평가(직전 급수 없음) | `previousClassKey: null` / 생략 | 승급 배너 미표시 (정상) |
| `previousClassKey`가 현재 급수와 같거나 더 높음 | 그대로 | 승급 배너 미표시 (정상) |
| `previousClassKey`에 모르는 값 | — | 무시(배너 미표시), 안전 |

---

## 7. 예시 응답

### 7-1. 정상 (상급반 · 고급반까지 90%)
2장의 전체 스키마(§2)가 이 케이스다.

### 7-2. 데이터 부족 (세션 1회)
```json
{
  "generatedAt": "2026-06-18T09:00:00+09:00",
  "period": { "from": "2026-06-17", "to": "2026-06-17" },
  "sessionCount": 1,
  "strokes": {
    "freestyle":    { "continuousMaxM": 50, "representativePace50Sec": 38 },
    "backstroke":   { "continuousMaxM": 0 },
    "breaststroke": { "continuousMaxM": 0 },
    "butterfly":    { "continuousMaxM": 0 }
  },
  "nonstop": { "maxDistanceM": 200, "maxDurationSec": 240 },
  "previousClassKey": null
}
```
→ 화면: 결과 표시 + "2회 더 기록하면 정확한 급수가 나와요".

### 7-3. 기록 없음 (첫 진입)
```json
{
  "generatedAt": "2026-06-18T09:00:00+09:00",
  "period": { "from": "2026-06-18", "to": "2026-06-18" },
  "sessionCount": 0,
  "strokes": {
    "freestyle":    { "continuousMaxM": 0 },
    "backstroke":   { "continuousMaxM": 0 },
    "breaststroke": { "continuousMaxM": 0 },
    "butterfly":    { "continuousMaxM": 0 }
  },
  "nonstop": { "maxDistanceM": 0, "maxDurationSec": 0 },
  "previousClassKey": null
}
```

---

## 8. 이 응답에 "포함하지 않는" 것 (의도적 제외)

| 항목 | 이유 | 향후 |
|---|---|---|
| 상위 백분위 ("상위 12%") | 셩 전체 유저 분포 데이터 필요 | 출시 후 별도 엔드포인트 |
| 같은 급수 비율 | 급수별 유저 분포 필요 | 출시 후 별도 엔드포인트 |
| 급수명/밴드/진척도 % | 앱이 계산 (서버 책임 아님) | — |
| 공유 이미지 | 앱에서 합성 | — |

---

## 9. 앱 적용 방법 (서버 준비되면 이게 끝)

`artifacts/syeong/src/data/classMock.ts`에서 목 객체 대신 fetch 결과를 넣으면 된다:

```ts
import { compute } from "@/class/engine";
import { fromClassEvaluationDto } from "@/class/dto";

const token = /* 로그인 토큰 */;
const dto = await fetch(
  `${import.meta.env.BASE_URL}api/insights/class-evaluation`,
  { headers: { Authorization: `Bearer ${token}` } }
).then((r) => r.json());

export const classResult = compute(fromClassEvaluationDto(dto));
```
- `fromClassEvaluationDto`: 응답(DTO) → 분류 엔진 입력 어댑터 (`src/class/dto.ts`)
- `compute`: 분류·밴드·승급 진척도 계산 (`src/class/engine.ts`)
- 화면(`ClassResultView`)·엔진은 **건드릴 필요 없음**.

---

## 부록 A. 앱이 사실값을 해석하는 임계값 (투명성·테스트 데이터 생성용)

> 서버가 알 필요는 없지만, 어떤 값이 화면을 어떻게 바꾸는지 알면 테스트 데이터 만들기 쉽다.

**급수 분류 (영법별 `continuousMaxM` + `nonstop.maxDistanceM` + 자유형 페이스)**
| 급수 | 조건(모두 충족) |
|---|---|
| 기초반 | (기본) |
| 초급반 | 자유형 ≥ 25 |
| 중급반 | 자유형 ≥ 50, 배영 ≥ 25 |
| 상급반 | 자유형 ≥ 50, 배영 ≥ 50, 평영 ≥ 25 |
| 고급반 | 자유형·배영·평영 ≥ 50, 접영 ≥ 25 |
| 연수반 | 4영법 ≥ 50, 무휴식 ≥ 2000 |
| 마스터즈 | 4영법 ≥ 50, 무휴식 ≥ 2000, 자유형 50m ≤ 30초 |

**영법별 진도 상태**: ≥50 완성 · ≥25 획득 · >0 진행중 · 0 미시작 (진도바 = 거리/50)

**축2 스탯 밴드**
- 거리(`nonstop.maxDistanceM`): <500 입문 · <1000 중급 · <2000 상급 · ≥2000 연수
- 지구력(`maxDurationSec`→분): <10 입문 · <20 중급 · <40 상급 · ≥40 연수
- 속도(자유형 50m 초): <30 연수 · <40 고급 · <50 상급 · <60 중급 · ≥60 입문

**최소 세션**: `sessionCount` ≥ 3 이어야 "충족". 미만이면 `3 - sessionCount`회 더 안내.
