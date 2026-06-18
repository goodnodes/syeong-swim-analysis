import { compute } from "@/class/engine";
import { fromClassEvaluationDto, type ClassEvaluationDto } from "@/class/dto";

// 서버가 내려줄 응답 예시(목). "지훈" 사용자.
// 자유형/배영/평영은 획득(평영 50m), 접영은 진행중(15m)이라 상급반으로 분류되고
// 고급반(접영 25m)까지 한 조건만 남아 승급 진척도가 풍부하게 보인다.
//
// 실제 서버 연동 시 이 객체 대신 fetch 결과를 넣으면 끝:
//   const dto = await fetch(`${import.meta.env.BASE_URL}api/insights/class-evaluation`,
//     { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
//   const classResult = compute(fromClassEvaluationDto(dto));
export const mockClassEvaluationDto: ClassEvaluationDto = {
  generatedAt: "2026-06-18T09:00:00+09:00",
  period: { from: "2026-05-20", to: "2026-06-17" },
  sessionCount: 6,
  strokes: {
    freestyle: { continuousMaxM: 100, representativePace50Sec: 33, cumulativeDistanceM: 42000, pbPace50Sec: 31 },
    backstroke: { continuousMaxM: 75, representativePace50Sec: 41, cumulativeDistanceM: 12000, pbPace50Sec: 40 },
    breaststroke: { continuousMaxM: 50, representativePace50Sec: 45, cumulativeDistanceM: 9000, pbPace50Sec: 44 },
    butterfly: { continuousMaxM: 15, representativePace50Sec: 39, cumulativeDistanceM: 1500, pbPace50Sec: 38 },
  },
  nonstop: { maxDistanceM: 1500, maxDurationSec: 1680, pbDistanceM: 1500 },
  previousClassKey: "intermediate",
};

export const evaluationInput = fromClassEvaluationDto(mockClassEvaluationDto);
export const classResult = compute(evaluationInput);
