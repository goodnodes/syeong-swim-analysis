// 셩 클래스(나는 수영 무슨 반?) 분류 엔진.
// 명세: attached_assets/cpo_셩클래스_결과화면데이터명세_*.md
//
// 정확한 급수표/PASS 조건은 CPO 핸드오프 문서에 있으나, 여기서는 명세에 명시된
// 임계값(25m 획득 · 영법별 50m=연수 · 무휴식 500/1000/2000m · 최소 3세션)을
// 기반으로 한 자체 규칙을 사용한다. 규칙은 이 파일(LADDER/밴드/매핑)에 모아
// 두었으므로 실제 규칙이 확정되면 이 상수만 교체하면 된다.

export type StrokeId = "freestyle" | "backstroke" | "breaststroke" | "butterfly";

export type ClassKey =
  | "basic"
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert"
  | "yeonsu"
  | "masters";

export interface EvaluationInput {
  strokes: Record<StrokeId, { continuous: number; pace50?: number }>;
  nonstopMax: number; // 무휴식 최장 거리 (m)
  nonstopMaxDurationSec: number; // 그 블록 소요 시간 (sec)
  paceFR50: number; // 자유형 50m 대표 페이스 (sec)
  sessionCount: number; // 판정에 쓴 유효 세션 수
  dateFrom: string; // 기준 기간 시작 (YYYY-MM-DD)
  dateTo: string; // 기준 기간 끝
  prevClassKey?: ClassKey; // 직전 급수 (승급 판정용)
}

type Cmp = "gte" | "lte";

export interface Condition {
  id: string;
  label: string;
  current: (i: EvaluationInput) => number;
  target: number;
  unit: string;
  cmp: Cmp;
}

export interface ClassDef {
  key: ClassKey;
  name: string;
  short: string;
  desc: string;
  color: string;
  conditions: Condition[];
}

const STROKE_KR: Record<StrokeId, string> = {
  freestyle: "자유형",
  backstroke: "배영",
  breaststroke: "평영",
  butterfly: "접영",
};

const cont = (s: StrokeId, target: number): Condition => ({
  id: `${s}-${target}`,
  label: `${STROKE_KR[s]} 연속 ${target}m`,
  current: (i) => i.strokes[s].continuous,
  target,
  unit: "m",
  cmp: "gte",
});

const nonstop = (target: number): Condition => ({
  id: `nonstop-${target}`,
  label: `무휴식 ${target}m`,
  current: (i) => i.nonstopMax,
  target,
  unit: "m",
  cmp: "gte",
});

const paceCond = (target: number): Condition => ({
  id: `paceFR50-${target}`,
  label: `자유형 50m ${target}초 이내`,
  current: (i) => i.paceFR50,
  target,
  unit: "초",
  cmp: "lte",
});

// 전체 7단계 (오름차순). 각 단계 conditions 를 모두 만족하면 그 단계 이상.
export const LADDER: ClassDef[] = [
  { key: "basic", name: "기초반", short: "기초", color: "#98A2B3", desc: "물과 친해지고 호흡·자유형 기초를 익히는 단계", conditions: [] },
  { key: "beginner", name: "초급반", short: "초급", color: "#83B9FF", desc: "자유형 25m를 쉬지 않고 완성하는 단계", conditions: [cont("freestyle", 25)] },
  { key: "intermediate", name: "중급반", short: "중급", color: "#2684FC", desc: "자유형 50m와 배영을 익히는 단계", conditions: [cont("freestyle", 50), cont("backstroke", 25)] },
  { key: "advanced", name: "상급반", short: "상급", color: "#0067EB", desc: "자유형·배영·평영 3영법을 구사하는 단계", conditions: [cont("freestyle", 50), cont("backstroke", 50), cont("breaststroke", 25)] },
  { key: "expert", name: "고급반", short: "고급", color: "#225DD0", desc: "접영까지 4영법을 모두 완성한 단계", conditions: [cont("freestyle", 50), cont("backstroke", 50), cont("breaststroke", 50), cont("butterfly", 25)] },
  { key: "yeonsu", name: "연수반", short: "연수", color: "#00BA65", desc: "전 영법 50m와 장거리 지구력을 갖춘 단계", conditions: [cont("freestyle", 50), cont("backstroke", 50), cont("breaststroke", 50), cont("butterfly", 50), nonstop(2000)] },
  { key: "masters", name: "마스터즈", short: "마스터즈", color: "#0F172A", desc: "대회 수준의 속도와 기록을 갖춘 단계", conditions: [cont("freestyle", 50), cont("backstroke", 50), cont("breaststroke", 50), cont("butterfly", 50), nonstop(2000), paceCond(30)] },
];

// 영역 5. 공공 수영장 기준 매핑 (상수)
export const PUBLIC_MAPPING: Record<ClassKey, { label: string; source: string }> = {
  basic: { label: "일반 수영장 기준 강습 입문반 수준", source: "잠실종합운동장 수영장 기준" },
  beginner: { label: "일반 수영장 기준 초급반 수준", source: "잠실종합운동장 수영장 기준" },
  intermediate: { label: "일반 수영장 기준 중급반 수준", source: "잠실종합운동장 수영장 기준" },
  advanced: { label: "일반 수영장 기준 상급반 수준", source: "잠실종합운동장 수영장 기준" },
  expert: { label: "일반 수영장 기준 고급반(연수 직전) 수준", source: "잠실종합운동장 수영장 기준" },
  yeonsu: { label: "일반 수영장 기준 연수반 수준", source: "잠실종합운동장 수영장 기준" },
  masters: { label: "일반 수영장 기준 마스터즈·선수반 수준", source: "잠실종합운동장 수영장 기준" },
};

export const MIN_SESSIONS_CLASSIFY = 3;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export function condMet(c: Condition, i: EvaluationInput): boolean {
  const v = c.current(i);
  return c.cmp === "gte" ? v >= c.target : v <= c.target;
}

export function condProgress(c: Condition, i: EvaluationInput): number {
  const v = c.current(i);
  if (c.cmp === "gte") return clamp01(c.target <= 0 ? 1 : v / c.target);
  return clamp01(v <= 0 ? 0 : c.target / v);
}

// ── 밴드(축2 스탯) ───────────────────────────────────────────────
interface Band {
  max: number;
  label: string;
}
const DISTANCE_BANDS: Band[] = [
  { max: 500, label: "입문 수준" },
  { max: 1000, label: "중급 수준" },
  { max: 2000, label: "상급 수준" },
  { max: Infinity, label: "연수 수준" },
];
const ENDURANCE_BANDS_MIN: Band[] = [
  { max: 10, label: "입문 수준" },
  { max: 20, label: "중급 수준" },
  { max: 40, label: "상급 수준" },
  { max: Infinity, label: "연수 수준" },
];
// 자유형 50m 페이스(초) — 낮을수록 빠름
const SPEED_BANDS: Band[] = [
  { max: 30, label: "연수 수준" },
  { max: 40, label: "고급 수준" },
  { max: 50, label: "상급 수준" },
  { max: 60, label: "중급 수준" },
  { max: Infinity, label: "입문 수준" },
];
const bandFor = (v: number, bands: Band[]) => (bands.find((b) => v < b.max) ?? bands[bands.length - 1]).label;

// ── 결과 타입 ────────────────────────────────────────────────────
export type StrokeStatus = "done" | "acquired" | "progress" | "none";

export interface StrokeProgress {
  id: StrokeId;
  nameKr: string;
  continuous: number;
  status: StrokeStatus;
  progressTo50: number;
  pace50?: number;
}

export interface StatCard {
  value: number;
  label: string; // 표시 텍스트 (예: "1500m", "28분", "33초")
  band: string;
  fill: number;
}

export interface PromotionCondition {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  cmp: Cmp;
  pct: number;
  met: boolean;
}

export interface ClassResult {
  classDef: ClassDef;
  subLabel?: string;
  stepIndex: number;
  stepTotal: number;
  oneLineDesc: string;
  strokes: StrokeProgress[];
  stats: { distance: StatCard; endurance: StatCard; speed: StatCard };
  promotion: {
    nextClassName: string;
    overallPct: number;
    conditions: PromotionCondition[];
    closestId?: string;
  } | null;
  publicMapping: { label: string; source: string };
  basis: {
    sessionCount: number;
    dateFrom: string;
    dateTo: string;
    minSessions: number;
    minMet: boolean;
    remaining: number;
  };
  promoted: { changed: boolean; from?: string; to?: string };
}

const STROKE_DISPLAY_ORDER: StrokeId[] = ["freestyle", "backstroke", "breaststroke", "butterfly"];

function strokeStatus(c: number): StrokeStatus {
  if (c >= 50) return "done";
  if (c >= 25) return "acquired";
  if (c > 0) return "progress";
  return "none";
}

function subLabelFor(def: ClassDef, i: EvaluationInput): string | undefined {
  if (def.key === "basic") {
    const c = i.strokes.freestyle.continuous;
    const n = c < 10 ? 1 : c < 20 ? 2 : 3;
    return `기초${n}`;
  }
  if (def.key === "masters") {
    const n = i.paceFR50 <= 27 ? 2 : 1;
    return `마스터즈${n}`;
  }
  return undefined;
}

export function classify(i: EvaluationInput): number {
  let idx = 0;
  for (let k = 0; k < LADDER.length; k++) {
    if (LADDER[k].conditions.every((c) => condMet(c, i))) idx = k;
  }
  return idx;
}

export function compute(i: EvaluationInput): ClassResult {
  const idx = classify(i);
  const classDef = LADDER[idx];

  const strokes: StrokeProgress[] = STROKE_DISPLAY_ORDER.map((id) => {
    const c = i.strokes[id].continuous;
    return {
      id,
      nameKr: STROKE_KR[id],
      continuous: c,
      status: strokeStatus(c),
      progressTo50: clamp01(c / 50),
      pace50: i.strokes[id].pace50,
    };
  });

  const durMin = Math.round(i.nonstopMaxDurationSec / 60);
  const stats = {
    distance: {
      value: i.nonstopMax,
      label: `${i.nonstopMax.toLocaleString()}m`,
      band: bandFor(i.nonstopMax, DISTANCE_BANDS),
      fill: clamp01(i.nonstopMax / 2000),
    },
    endurance: {
      value: durMin,
      label: `${durMin}분`,
      band: bandFor(durMin, ENDURANCE_BANDS_MIN),
      fill: clamp01(durMin / 40),
    },
    speed: {
      value: i.paceFR50,
      label: `${i.paceFR50}초`,
      band: bandFor(i.paceFR50, SPEED_BANDS),
      fill: clamp01((60 - i.paceFR50) / (60 - 25)),
    },
  };

  let promotion: ClassResult["promotion"] = null;
  if (idx < LADDER.length - 1) {
    const next = LADDER[idx + 1];
    const conditions: PromotionCondition[] = next.conditions.map((c) => {
      const met = condMet(c, i);
      return {
        id: c.id,
        label: c.label,
        current: Math.round(c.current(i)),
        target: c.target,
        unit: c.unit,
        cmp: c.cmp,
        pct: Math.round(condProgress(c, i) * 100),
        met,
      };
    });
    const overallPct = conditions.length
      ? Math.round(conditions.reduce((s, c) => s + c.pct, 0) / conditions.length)
      : 100;
    const unmet = conditions.filter((c) => !c.met);
    const closest = unmet.length ? unmet.reduce((a, b) => (b.pct > a.pct ? b : a)) : undefined;
    promotion = { nextClassName: next.name, overallPct, conditions, closestId: closest?.id };
  }

  let promoted = { changed: false } as ClassResult["promoted"];
  if (i.prevClassKey) {
    const prevIdx = LADDER.findIndex((c) => c.key === i.prevClassKey);
    if (prevIdx >= 0 && prevIdx < idx) {
      promoted = { changed: true, from: LADDER[prevIdx].name, to: classDef.name };
    }
  }

  return {
    classDef,
    subLabel: subLabelFor(classDef, i),
    stepIndex: idx + 1,
    stepTotal: LADDER.length,
    oneLineDesc: classDef.desc,
    strokes,
    stats,
    promotion,
    publicMapping: PUBLIC_MAPPING[classDef.key],
    basis: {
      sessionCount: i.sessionCount,
      dateFrom: i.dateFrom,
      dateTo: i.dateTo,
      minSessions: MIN_SESSIONS_CLASSIFY,
      minMet: i.sessionCount >= MIN_SESSIONS_CLASSIFY,
      remaining: Math.max(0, MIN_SESSIONS_CLASSIFY - i.sessionCount),
    },
    promoted,
  };
}
