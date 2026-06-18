// Ported from goodnodes/syeong_design_data (src/lib/tokens) — web-adapted.
// Source of truth for brand values not expressible as shadcn CSS vars
// (gradients, per-stroke signal colors, shadows, raw radius/space scales).
// Keep in sync with the design-data repo token files.

export const colors = {
  blue: { 50: "#EBF4FF", 100: "#CBE2FF", 200: "#AECEFF", 300: "#83B9FF", 400: "#64A8FF", 500: "#2684FC", 600: "#0067EB" },
  green: { 50: "#E5FAEE", 100: "#ABF2D2", 500: "#22D081", 600: "#00BA65" },
  yellow: { 50: "#FFF7E6", 500: "#FFA800" },
  red: { 50: "#FFE5E5", 500: "#FF2C2C" },
  gray: { 0: "#FFFFFF", 50: "#F9FAFC", 100: "#F4F5F7", 200: "#EFF1F3", 300: "#E1E4EA", 400: "#C5CCD3", 500: "#98A2B3", 600: "#8B95A1", 700: "#697078", 800: "#1D2939", 900: "#282A2C" },
} as const;

// 영법 도메인 시그널 컬러 (영법바·범례 등에서만 사용 — 의미 오해 방지)
export const strokeColors = {
  butterfly: "#2684FC", // 접영
  backstroke: "#FFA800", // 배영
  breaststroke: "#AECEFF", // 평영
  freestyle: "#22D081", // 자유형
  other: "#8B95A1", // 기타
} as const;

export type StrokeKey = keyof typeof strokeColors;

export const STROKE_ORDER: readonly StrokeKey[] = ["butterfly", "backstroke", "breaststroke", "freestyle", "other"];

export const STROKE_FULLNAME_KR: Record<StrokeKey, string> = {
  butterfly: "접영",
  backstroke: "배영",
  breaststroke: "평영",
  freestyle: "자유형",
  other: "기타",
};

export const STROKE_NAME_KR: Record<StrokeKey, string> = {
  butterfly: "접",
  backstroke: "배",
  breaststroke: "평",
  freestyle: "자",
  other: "기타",
};

// figma Paint Style 1:1 (CSS linear-gradient 문자열)
export const gradients = {
  brandPro: "linear-gradient(90deg, #225DD0 0%, #2684FC 100%)",
  strokeBarA: "linear-gradient(270deg, #22D081 0%, #2684FC 100%)",
  strokeBarB: "linear-gradient(90deg, #22D081 0%, #23BDA0 12.5%, #24ADBA 23.08%, #2597DD 37.02%, #2684FC 49.52%, #2684FC 100%)",
  spectrum: "linear-gradient(90deg, #FFA800 0%, #D7AF17 6.73%, #94BB3F 18.22%, #22D081 37.5%, #39D096 50%, #79CFD0 76.46%, #96CEE9 89.09%, #AECEFF 100%)",
  dataBlue: "linear-gradient(180deg, #F4F5F7 0%, #D0E0F7 16%, #A6C8F7 34%, #5F9FF8 57%, #3587F8 76%, #0068F8 100%)",
} as const;

export type GradientKey = keyof typeof gradients;

// figma Effect Style — CSS box-shadow
export const shadow = {
  sm: "0px 2px 4px 0px rgba(0, 0, 0, 0.10)",
  md: "0px 6px 14px 0px rgba(0, 0, 0, 0.08)",
  lg: "0px 10px 24px 0px rgba(0, 0, 0, 0.16)",
  brand: "0px 2px 8px 0px rgba(38, 132, 252, 0.25)",
} as const;

export const radius = { 0: 0, 4: 4, 6: 6, 8: 8, 10: 10, 12: 12, 16: 16, 20: 20, full: 9999 } as const;

export const space = { 0: 0, 2: 2, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 10: 10, 11: 11, 12: 12, 14: 14, 16: 16, 18: 18, 20: 20, 24: 24, 30: 30, 40: 40, 60: 60 } as const;
