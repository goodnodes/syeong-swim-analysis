// 셩 클래스 결과 — 실제 서버(api-dev) 호출 클라이언트.
// 서버 구현: goodnodes/Syeong_server  GET /v2/insights/class-evaluation (Bearer)
// 응답 형태는 ClassEvaluationDto 와 1:1 일치(서버 response/class_evaluation.go).
import { API_BASE } from "@/seed/api";
import type { ClassEvaluationDto } from "./dto";

export async function fetchClassEvaluation(token: string): Promise<ClassEvaluationDto> {
  const res = await fetch(`${API_BASE}/v2/insights/class-evaluation`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`결과 불러오기 실패 (${res.status})${text ? `: ${text}` : ""}`);
  }
  return (await res.json()) as ClassEvaluationDto;
}
