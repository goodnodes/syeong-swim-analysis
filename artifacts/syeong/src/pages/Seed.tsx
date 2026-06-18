import { useState } from "react";
import { Layout } from "@/components/Layout";
import {
  login as apiLogin,
  seedAppleHealth,
  getStoredToken,
  setStoredToken,
} from "@/seed/api";
import {
  generateAppleHealthPayload,
  buildRequestBody,
  type SeedSummary,
} from "@/seed/generateAppleHealthPayload";
import { shadow } from "@/theme/tokens";
import { Smartphone, Lock, LogOut, Sprout, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function todayParts() {
  const d = new Date();
  return { y: d.getFullYear(), m: d.getMonth() + 1, day: d.getDate() };
}

function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}분 ${s}초`;
}

export default function Seed() {
  const [token, setToken] = useState<string | null>(getStoredToken());

  // 로그인 상태
  const [pnum, setPnum] = useState("01011123334");
  const [pwd, setPwd] = useState("push-to-prod");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // 시딩 상태
  const t = todayParts();
  const [dateStr, setDateStr] = useState(
    `${t.y}-${String(t.m).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`,
  );
  const [count, setCount] = useState(1);
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);
  const [results, setResults] = useState<SeedSummary[]>([]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const tk = await apiLogin(pnum.trim(), pwd);
      setStoredToken(tk);
      setToken(tk);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    setStoredToken(null);
    setToken(null);
    setResults([]);
    setSeedError(null);
  }

  async function handleSeed() {
    if (!token) return;
    setSeedError(null);
    setSeedLoading(true);
    try {
      const [y, m, d] = dateStr.split("-").map(Number);
      const summaries: SeedSummary[] = [];
      for (let i = 0; i < count; i++) {
        const { payload, summary } = generateAppleHealthPayload({ year: y, month: m, day: d });
        const body = buildRequestBody([payload]);
        await seedAppleHealth(token, body);
        summaries.push(summary);
      }
      setResults((prev) => [...summaries, ...prev]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setSeedError(msg);
      if (/401|403|토큰|token/i.test(msg)) {
        // 인증 만료 가능성 안내 (자동 로그아웃은 하지 않음)
      }
    } finally {
      setSeedLoading(false);
    }
  }

  return (
    <Layout>
      <div className="px-5 pt-8 pb-6">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
            style={{ backgroundImage: "linear-gradient(90deg, #225DD0 0%, #2684FC 100%)" }}
          >
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">데이터 시딩</h1>
            <p className="text-xs text-muted-foreground">api-dev.syeong.com · Apple Health</p>
          </div>
        </div>

        {!token ? (
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <p className="text-sm text-muted-foreground">
              시딩하려면 먼저 핸드폰 번호와 비밀번호로 로그인하세요.
            </p>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">핸드폰 번호</span>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-3.5 py-3">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <input
                  value={pnum}
                  onChange={(e) => setPnum(e.target.value)}
                  inputMode="numeric"
                  placeholder="01012341234"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">비밀번호</span>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-3.5 py-3">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="비밀번호"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </label>

            {loginError && (
              <div className="flex items-start gap-2 rounded-xl bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="break-all">{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
              style={{ boxShadow: shadow.brand }}
            >
              {loginLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              로그인
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-5">
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted px-3.5 py-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-[#22D081]" />
                <span className="font-medium text-foreground">로그인됨</span>
                <span className="text-muted-foreground">{pnum}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-3.5 w-3.5" />
                로그아웃
              </button>
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">시딩 날짜</span>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted px-3.5 py-3 text-sm text-foreground outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">
                  세션 수: {count}
                </span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full accent-[#2684FC]"
                />
              </label>

              <p className="text-xs text-muted-foreground">
                선택한 날짜에 25m/50m 풀 수영 워크아웃을 무작위로 생성해 Apple Health 기록으로
                서버에 전송합니다.
              </p>

              <button
                onClick={handleSeed}
                disabled={seedLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
                style={{ boxShadow: shadow.brand }}
              >
                {seedLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sprout className="h-4 w-4" />}
                {seedLoading ? "시딩 중..." : "시딩하기"}
              </button>

              {seedError && (
                <div className="flex items-start gap-2 rounded-xl bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="break-all">{seedError}</span>
                </div>
              )}
            </div>

            {results.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-foreground">시딩 결과 ({results.length})</h2>
                {results.map((r, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22D081]" />
                      <span className="text-sm font-bold text-foreground">
                        {r.poolLength}m 풀 · {r.totalLaps}랩 · {r.totalDistance}m
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>시간: {fmtDuration(r.duration)}</span>
                      <span>칼로리: {r.calories} kcal</span>
                      <span className="col-span-2">시작: {r.startDate.slice(0, 16).replace("T", " ")}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                      {r.strokes.free > 0 && <Tag color="#22D081">자유형 {r.strokes.free}m</Tag>}
                      {r.strokes.breast > 0 && <Tag color="#AECEFF">평영 {r.strokes.breast}m</Tag>}
                      {r.strokes.back > 0 && <Tag color="#FFA800">배영 {r.strokes.back}m</Tag>}
                      {r.strokes.butterfly > 0 && <Tag color="#2684FC">접영 {r.strokes.butterfly}m</Tag>}
                      {r.strokes.kickBoard > 0 && <Tag color="#8B95A1">킥판 {r.strokes.kickBoard}m</Tag>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
}
