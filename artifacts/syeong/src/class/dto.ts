// 셩 클래스 결과 화면 ← 서버 응답 계약(DTO).
//
// 설계 원칙: 서버는 "측정된 사실(영법별 인사이트 + 세션 메타)"만 내려준다.
// 급수 분류·밴드 매핑·승급 진척도·카피는 전부 앱(engine.ts)이 계산한다.
// → 서버는 이미 계산 중인 인사이트 값을 그대로 노출하면 되고, UI 규칙 변경이
//   서버에 영향을 주지 않는다.
//
// 권장 엔드포인트: GET /v2/insights/class-evaluation  (Authorization: Bearer)
//   - 단위: 모든 거리 필드는 미터(m), 페이스는 초(sec) 기준.
//   - 서버 내부 영법 enum(FREE/BACK/BREAST/BUTTERFLY)은
//     freestyle/backstroke/breaststroke/butterfly 키로 매핑해 내려준다.

import type { ClassKey, EvaluationInput, StrokeId } from "./engine";

export interface StrokeFactsDto {
  /** 그 영법으로 쉬지 않고 간 최대 거리(m). 획득(25)·연수(50)·진도바 판정에 사용. (필수) */
  continuousMaxM: number;
  /** 대표 50m 페이스(초). freestyle 값은 속도 스탯으로 쓰이므로 사실상 필수. */
  representativePace50Sec?: number | null;
  /** 누적 거리(m). 영법바 미니 시각화(영역7)용. (선택) */
  cumulativeDistanceM?: number | null;
  /** 영법별 PB 페이스(초). 대표 PB(영역7)용. (선택) */
  pbPace50Sec?: number | null;
}

export interface ClassEvaluationDto {
  /** 응답 생성 시각(ISO-8601). */
  generatedAt: string;
  /** 판정에 사용한 기록 기간(세션 날짜 min~max), YYYY-MM-DD. */
  period: { from: string; to: string };
  /** 판정에 쓴 유효 세션 수(이상 랩 제외 후). */
  sessionCount: number;
  /** 4영법 사실값. 미측정 영법도 continuousMaxM:0 으로 반드시 포함. */
  strokes: Record<StrokeId, StrokeFactsDto>;
  /** 무휴식 구간 사실값(거리 스탯·지구력 스탯·연수 조건에 사용). */
  nonstop: {
    /** 한 번에 간 무휴식 최장 거리(m). (필수) */
    maxDistanceM: number;
    /** 그 무휴식 블록의 소요 시간(초). (필수) */
    maxDurationSec: number;
    /** 역대 무휴식 최장 거리(m). PB(영역7)용. (선택) */
    pbDistanceM?: number | null;
  };
  /**
   * 직전 평가에서 분류됐던 급수 key. 승급 배너 판정용.
   * 서버가 직전 분류 결과를 저장해 두고 내려준다. 첫 평가면 null/생략.
   */
  previousClassKey?: ClassKey | null;
}

/** 서버 응답(DTO) → 분류 엔진 입력(EvaluationInput) 어댑터. */
export function fromClassEvaluationDto(dto: ClassEvaluationDto): EvaluationInput {
  const s = dto.strokes;
  const toStroke = (f: StrokeFactsDto) => ({
    continuous: f.continuousMaxM,
    pace50: f.representativePace50Sec ?? undefined,
  });
  return {
    strokes: {
      freestyle: toStroke(s.freestyle),
      backstroke: toStroke(s.backstroke),
      breaststroke: toStroke(s.breaststroke),
      butterfly: toStroke(s.butterfly),
    },
    nonstopMax: dto.nonstop.maxDistanceM,
    nonstopMaxDurationSec: dto.nonstop.maxDurationSec,
    // 속도 스탯 = 자유형 50m 대표 페이스. 없으면 큰 값으로 둬서 '입문' 밴드 처리.
    paceFR50: s.freestyle.representativePace50Sec ?? 999,
    sessionCount: dto.sessionCount,
    dateFrom: dto.period.from,
    dateTo: dto.period.to,
    prevClassKey: dto.previousClassKey ?? undefined,
  };
}
