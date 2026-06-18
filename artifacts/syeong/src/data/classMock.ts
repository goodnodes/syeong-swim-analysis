import { compute, type EvaluationInput } from "@/class/engine";

// 데모용 시드 인사이트 — "지훈" 사용자.
// 자유형/배영/평영은 획득(평영은 50m), 접영은 진행중(15m)이라 상급반으로 분류되고
// 고급반(접영 25m)까지 한 조건만 남아 승급 진척도가 풍부하게 보인다.
// 실제 서버 연동 시 이 객체를 영법별 인사이트 응답으로 대체하면 된다.
export const evaluationInput: EvaluationInput = {
  strokes: {
    freestyle: { continuous: 100, pace50: 33 },
    backstroke: { continuous: 75, pace50: 41 },
    breaststroke: { continuous: 50, pace50: 45 },
    butterfly: { continuous: 15, pace50: 39 },
  },
  nonstopMax: 1500,
  nonstopMaxDurationSec: 1680, // 28분
  paceFR50: 33,
  sessionCount: 6,
  dateFrom: "2026-05-20",
  dateTo: "2026-06-17",
  prevClassKey: "intermediate", // 직전 중급반 → 이번에 상급반으로 승급
};

export const classResult = compute(evaluationInput);
