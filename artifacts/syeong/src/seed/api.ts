// Syeong dev 서버에 직접 붙는 시딩용 API 클라이언트.
// 서버 CORS가 "*" 를 허용하므로 브라우저에서 직접 호출 가능.
export const API_BASE = "https://api-dev.syeong.com";

const TOKEN_KEY = "syeong-seed-token";

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

// 서버 코드 참고: POST /auth { pnum, pwd } -> { accessToken }
export async function login(pnum: string, pwd: string): Promise<string> {
  const res = await fetch(`${API_BASE}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pnum, pwd }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`로그인 실패 (${res.status})${text ? `: ${text}` : ""}`);
  }
  let data: Record<string, unknown> = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    /* non-json */
  }
  const token =
    (data.accessToken as string) ||
    (data.access_token as string) ||
    (data.token as string);
  if (!token) {
    throw new Error(`accessToken 을 응답에서 찾지 못했습니다: ${text.slice(0, 200)}`);
  }
  return token;
}

// 서버 코드 참고: POST /v2/records/apple-health (Bearer) { items, syncContext }
export async function seedAppleHealth(
  token: string,
  body: unknown,
): Promise<{ status: number; data: unknown }> {
  const res = await fetch(`${API_BASE}/v2/records/apple-health`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`시딩 실패 (${res.status})${text ? `: ${text}` : ""}`);
  }
  let data: unknown = text;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    /* keep text */
  }
  return { status: res.status, data };
}
