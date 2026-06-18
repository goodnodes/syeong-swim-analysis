import type { ClassResult, StrokeStatus } from "@/class/engine";
import { strokeColors, gradients } from "@/theme/tokens";
import {
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Ruler,
  Timer,
  Gauge,
  Building2,
  ClipboardCheck,
  Clock3,
  Home,
  ChevronRight,
} from "lucide-react";

const STROKE_TOKEN: Record<string, keyof typeof strokeColors> = {
  freestyle: "freestyle",
  backstroke: "backstroke",
  breaststroke: "breaststroke",
  butterfly: "butterfly",
};

const STATUS_META: Record<StrokeStatus, { label: string; color: string }> = {
  done: { label: "50m+ 완성", color: "#00BA65" },
  acquired: { label: "25m 획득", color: "#2684FC" },
  progress: { label: "진행중", color: "#FFA800" },
  none: { label: "미시작", color: "#C5CCD3" },
};

function fmtDate(d: string) {
  const [, m, day] = d.split("-");
  return `${Number(m)}월 ${Number(day)}일`;
}

export function ClassResultView({
  result,
  onHome,
}: {
  result: ClassResult;
  onHome?: () => void;
}) {
  const { classDef, subLabel, stepIndex, stepTotal, oneLineDesc, strokes, stats, promotion, publicMapping, basis, promoted } = result;

  return (
    <div className="flex flex-col bg-gray-50 min-h-full animate-in fade-in duration-500">
      {/* 영역 1. 히어로 */}
      <div className="relative overflow-hidden text-white px-6 pt-14 pb-9 rounded-b-[36px] shadow-xl" style={{ background: gradients.brandPro }}>
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "16px 16px" }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            분석 완료
          </div>

          <p className="text-white/70 text-sm font-medium mb-1.5">나의 셩 클래스</p>
          <div className="flex items-end gap-2.5 mb-3">
            <h1 className="text-[44px] leading-none font-black tracking-tight">{classDef.name}</h1>
            {subLabel && (
              <span className="mb-1 px-2.5 py-1 rounded-lg bg-white text-[13px] font-bold" style={{ color: classDef.color }}>
                {subLabel}
              </span>
            )}
          </div>
          <p className="text-white/85 text-sm font-medium mb-6">{oneLineDesc}</p>

          {/* 급수 단계 표시 (7단계 중 위치) */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: stepTotal }).map((_, k) => (
              <div
                key={k}
                className="h-1.5 rounded-full flex-1 transition-all"
                style={{ background: k < stepIndex ? "#fff" : "rgba(255,255,255,0.28)" }}
              />
            ))}
          </div>
          <p className="text-white/60 text-[11px] font-semibold mt-2">
            전체 {stepTotal}단계 중 {stepIndex}단계
          </p>
        </div>
      </div>

      <div className="px-5 pt-5 pb-8 space-y-4">
        {/* 승급 축하 배너 */}
        {promoted.changed && (
          <div className="flex items-center gap-3 rounded-2xl p-3.5 bg-green-50 border border-green-100 animate-in slide-in-from-top-2">
            <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-green-700">축하해요, 승급했어요!</p>
              <p className="text-xs text-green-600 flex items-center gap-1 font-medium">
                {promoted.from} <ChevronRight className="w-3 h-3" /> {promoted.to}
              </p>
            </div>
          </div>
        )}

        {/* 영역 2. 영법별 진도 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-[15px] font-bold text-gray-900 mb-4">영법별 진도</h2>
          <div className="space-y-4">
            {strokes.map((s) => {
              const color = strokeColors[STROKE_TOKEN[s.id]];
              const meta = STATUS_META[s.status];
              return (
                <div key={s.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                      <span className="text-sm font-semibold text-gray-800">{s.nameKr}</span>
                      <span className="text-sm font-bold text-gray-400">{s.continuous}m</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: meta.color }}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(s.progressTo50 * 100, s.continuous > 0 ? 6 : 0)}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-gray-400 mt-3">진도바는 연수 조건(영법별 50m) 대비 진척이에요.</p>
        </section>

        {/* 영역 3. 축2 스탯 카드 */}
        <section>
          <h2 className="text-[15px] font-bold text-gray-900 mb-3 px-1">내 수영 능력치</h2>
          <div className="grid grid-cols-3 gap-2.5">
            <StatCardView icon={<Ruler className="w-4 h-4" />} title="거리" stat={stats.distance} />
            <StatCardView icon={<Timer className="w-4 h-4" />} title="지구력" stat={stats.endurance} />
            <StatCardView icon={<Gauge className="w-4 h-4" />} title="속도" stat={stats.speed} />
          </div>
        </section>

        {/* 영역 4. 승급 진척도 */}
        {promotion && (
          <section className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[15px] font-bold text-gray-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-primary" />
                다음 급수까지
              </h2>
              <span className="text-xs font-bold text-primary bg-blue-50 px-2.5 py-1 rounded-full">{promotion.nextClassName}</span>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black text-gray-900">{promotion.overallPct}</span>
              <span className="text-lg font-bold text-gray-400 mb-1">%</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden mb-5">
              <div className="h-full rounded-full transition-all" style={{ width: `${promotion.overallPct}%`, background: gradients.brandPro }} />
            </div>

            <div className="space-y-3">
              {promotion.conditions.map((c) => {
                const highlight = c.id === promotion.closestId;
                const pct = c.cmp === "lte" ? Math.min(100, Math.round((c.target / Math.max(c.current, 1)) * 100)) : Math.min(100, Math.round((c.current / c.target) * 100));
                return (
                  <div key={c.id} className={`rounded-xl p-3 border ${highlight ? "border-blue-200 bg-blue-50/60" : "border-transparent bg-gray-50"}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {c.met ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border-2 border-gray-300 inline-block" />
                        )}
                        <span className={`text-sm font-semibold ${c.met ? "text-gray-400 line-through" : "text-gray-800"}`}>{c.label}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-500">
                        {c.current} / {c.target}
                        {c.unit}
                      </span>
                    </div>
                    {!c.met && (
                      <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                    {highlight && !c.met && <p className="text-[11px] text-primary font-semibold mt-1.5">거의 다 왔어요! 가장 가까운 조건이에요.</p>}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 영역 5. 공공 수영장 기준 매핑 */}
        <section className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{publicMapping.label}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{publicMapping.source}</p>
          </div>
        </section>

        {/* 영역 6. 판정 근거 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-[15px] font-bold text-gray-900 flex items-center gap-1.5 mb-4">
            <ClipboardCheck className="w-4 h-4 text-gray-400" />
            판정 근거
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">판정 기준 세션</span>
              <span className="text-sm font-bold text-gray-900">{basis.sessionCount}회</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">기준 기간</span>
              <span className="text-sm font-bold text-gray-900">
                {fmtDate(basis.dateFrom)} ~ {fmtDate(basis.dateTo)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">최소 세션 ({basis.minSessions}회)</span>
              {basis.minMet ? (
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 충족
                </span>
              ) : (
                <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock3 className="w-3.5 h-3.5" /> {basis.remaining}회 더 필요
                </span>
              )}
            </div>
            {!basis.minMet && <p className="text-[11px] text-gray-400">{basis.remaining}회 더 기록하면 정확한 급수가 나와요.</p>}
          </div>
          <p className="text-[11px] text-gray-400 mt-4 pt-3 border-t border-gray-100">오리발·킥판 등 이상 랩은 판정에서 제외했어요.</p>
        </section>

        {onHome && (
          <button
            onClick={onHome}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform mt-2"
          >
            <Home className="w-5 h-5" />
            홈으로 돌아가기
          </button>
        )}
      </div>
    </div>
  );
}

function StatCardView({ icon, title, stat }: { icon: React.ReactNode; title: string; stat: ClassResult["stats"]["distance"] }) {
  return (
    <div className="bg-white rounded-2xl p-3.5 shadow-sm">
      <div className="flex items-center gap-1 text-gray-400 mb-2">
        {icon}
        <span className="text-xs font-semibold">{title}</span>
      </div>
      <p className="text-xl font-black text-gray-900 leading-none mb-1">{stat.label}</p>
      <p className="text-[11px] font-bold text-primary mb-2">{stat.band}</p>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.max(stat.fill * 100, 6)}%`, background: gradients.brandPro }} />
      </div>
    </div>
  );
}
