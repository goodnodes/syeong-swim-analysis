// 결과 화면 데이터 소스 훅.
// - 시딩 로그인 토큰이 있으면 실제 서버에서 사실값을 받아 분류 엔진으로 계산.
// - 토큰이 없으면(데모) 목 데이터로 폴백.
import { useEffect, useState } from "react";
import { compute, type ClassResult } from "./engine";
import { fromClassEvaluationDto } from "./dto";
import { fetchClassEvaluation } from "./api";
import { getStoredToken } from "@/seed/api";
import { classResult as mockResult } from "@/data/classMock";

export type ClassResultState =
  | { status: "loading" }
  | { status: "ready"; result: ClassResult; source: "live" | "mock" }
  | { status: "error"; message: string };

export function useClassResult(): ClassResultState {
  const [state, setState] = useState<ClassResultState>({ status: "loading" });

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setState({ status: "ready", result: mockResult, source: "mock" });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const dto = await fetchClassEvaluation(token);
        if (cancelled) return;
        setState({
          status: "ready",
          result: compute(fromClassEvaluationDto(dto)),
          source: "live",
        });
      } catch (e) {
        if (cancelled) return;
        setState({
          status: "error",
          message: e instanceof Error ? e.message : "불러오기에 실패했습니다",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
