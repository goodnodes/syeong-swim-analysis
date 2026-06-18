// Apple Health(HealthKit) 수영 워크아웃 1건을 서버 /v2/records/apple-health
// 요청 형태(applehealth.Payload)로 생성한다.
// 규격은 Syeong_app docs/plans/2026-03-24-swimming-data-seeding-design.md 의
// 랜덤 데이터 생성 스펙을 그대로 따른다.

export interface SeedDateParts {
  year: number;
  month: number; // 1-based
  day: number;
}

export interface SeedSummary {
  poolLength: number;
  totalLaps: number;
  totalDistance: number;
  duration: number; // seconds
  calories: number;
  strokes: {
    free: number;
    back: number;
    breast: number;
    butterfly: number;
    kickBoard: number;
  };
  startDate: string;
  endDate: string;
}

// HealthKit HKSwimmingStrokeStyle
const STROKE = {
  freestyle: 2,
  backstroke: 3,
  breaststroke: 4,
  butterfly: 5,
  kickboard: 6,
} as const;
type StrokeName = keyof typeof STROKE;

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number) => Math.random() * (max - min) + min;
const uuid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });

// kstMs = Date.UTC(...) 로 만든 "KST 벽시계" 값을 +0900 문자열로 직렬화.
// 브라우저 로컬 타임존과 무관하게 동일한 캘린더 시각을 만든다.
function fmtKst(kstMs: number): string {
  const d = new Date(kstMs);
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return (
    `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}` +
    `T${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}` +
    `.${p(d.getUTCMilliseconds(), 3)}+09:00`
  );
}

// 25m 기준 영법별 랩 시간(초) / 스트로크 수
const LAP_SPEC: Record<StrokeName, { time: [number, number]; strokes: [number, number] }> = {
  freestyle: { time: [18, 28], strokes: [12, 18] },
  breaststroke: { time: [25, 38], strokes: [8, 14] },
  backstroke: { time: [22, 32], strokes: [14, 20] },
  butterfly: { time: [20, 30], strokes: [6, 12] },
  kickboard: { time: [30, 45], strokes: [0, 0] },
};

function pickStroke(): StrokeName {
  const r = Math.random();
  if (r < 0.4) return "freestyle";
  if (r < 0.65) return "breaststroke";
  if (r < 0.8) return "backstroke";
  if (r < 0.9) return "butterfly";
  return "kickboard";
}

export function generateAppleHealthPayload(
  date: SeedDateParts,
  opts: { deviceOwner?: string; bundleId?: string } = {},
) {
  const poolLength = Math.random() < 0.5 ? 25 : 50;
  const factor = poolLength / 25;
  const totalLaps = randInt(10, 40);

  // 시작 시각: 06:00 ~ 20:00
  const startHour = randInt(6, 19);
  const startMin = randInt(0, 59);
  const baseMs = Date.UTC(date.year, date.month - 1, date.day, startHour, startMin, 0);

  const owner = opts.deviceOwner ?? "Syeong Apple Watch";
  const device = {
    name: "Apple Watch",
    manufacturer: "Apple Inc.",
    model: "Watch",
    hardwareVersion: "Watch6,2",
    softwareVersion: "10.3",
  };
  const sourceRevision = {
    source: { name: owner, bundleIdentifier: opts.bundleId ?? "com.apple.health" },
    version: "10.3",
    productType: "Watch6,2",
    operatingSystemVersion: "10.3.0",
  };

  let cursorSec = 0;
  const lapEvents: { type: number; startDate: string; endDate: string }[] = [];
  const pauseEvents: { type: number; startDate: string; endDate: string }[] = [];
  const strokeSamples: ReturnType<typeof buildStrokeSample>[] = [];
  const restWindows: [number, number][] = [];
  const strokeTotals = { free: 0, back: 0, breast: 0, butterfly: 0, kickBoard: 0 };

  let setLen = randInt(4, 8);
  let lapInSet = 0;

  for (let i = 0; i < totalLaps; i++) {
    const stroke = pickStroke();
    const spec = LAP_SPEC[stroke];
    const lapDur = Math.round(randFloat(spec.time[0], spec.time[1]) * factor);
    const lapStartMs = baseMs + cursorSec * 1000;
    const lapEndMs = lapStartMs + lapDur * 1000;

    lapEvents.push({
      type: 3, // HKWorkoutEventType.lap
      startDate: fmtKst(lapStartMs),
      endDate: fmtKst(lapEndMs),
    });

    const strokeCount = randInt(spec.strokes[0], spec.strokes[1]) * factor;
    if (strokeCount > 0) {
      strokeSamples.push(
        buildStrokeSample(STROKE[stroke], strokeCount, lapStartMs, lapEndMs, device, sourceRevision),
      );
    }
    if (stroke === "freestyle") strokeTotals.free += poolLength;
    else if (stroke === "backstroke") strokeTotals.back += poolLength;
    else if (stroke === "breaststroke") strokeTotals.breast += poolLength;
    else if (stroke === "butterfly") strokeTotals.butterfly += poolLength;
    else strokeTotals.kickBoard += poolLength;

    cursorSec += lapDur;
    lapInSet++;

    // 세트 사이 휴식
    if (lapInSet >= setLen && i < totalLaps - 1) {
      const rest = randInt(10, 30);
      const restStartMs = baseMs + cursorSec * 1000;
      const restEndMs = restStartMs + rest * 1000;
      pauseEvents.push({ type: 1, startDate: fmtKst(restStartMs), endDate: fmtKst(restStartMs) }); // pause
      pauseEvents.push({ type: 2, startDate: fmtKst(restEndMs), endDate: fmtKst(restEndMs) }); // resume
      restWindows.push([cursorSec, cursorSec + rest]);
      cursorSec += rest;
      lapInSet = 0;
      setLen = randInt(4, 8);
    }
  }

  const totalDurationSec = cursorSec;
  const endMs = baseMs + totalDurationSec * 1000;
  const totalDistance = poolLength * totalLaps;
  const calories = Math.round((totalDurationSec / 60) * randFloat(10, 14));
  const totalStrokeCount = strokeSamples.reduce((s, x) => s + x.quantity, 0);

  // 심박수 샘플: 5초 간격
  const heartRateSamples = [];
  for (let t = 0; t < totalDurationSec; t += 5) {
    const inRest = restWindows.some(([a, b]) => t >= a && t < b);
    const progress = t / Math.max(totalDurationSec, 1);
    const bpm = inRest
      ? Math.round(randFloat(90, 120) - progress * 5)
      : Math.round(randFloat(120, 150) + progress * 20);
    const ts = baseMs + t * 1000;
    heartRateSamples.push({
      uuid: uuid(),
      startDate: fmtKst(ts),
      endDate: fmtKst(ts),
      quantity: bpm,
      quantityType: "HKQuantityTypeIdentifierHeartRate",
      unit: "count/min",
      metadata: {},
      device,
      sourceRevision,
    });
  }

  const startDate = fmtKst(baseMs);
  const endDate = fmtKst(endMs);

  const workout = {
    uuid: uuid(),
    startDate,
    endDate,
    duration: totalDurationSec,
    workoutActivityType: 46, // swimming
    totalDistance: { quantity: totalDistance, unit: "m" },
    totalEnergyBurned: { quantity: calories, unit: "kcal" },
    totalSwimmingStrokeCount: { quantity: totalStrokeCount, unit: "count" },
    device,
    sourceRevision,
    metadata: {
      HKLapLength: { quantity: poolLength, unit: "m" },
      HKSwimmingLocationType: 1, // pool
      HKIndoorWorkout: 1,
      HKTimeZone: "Asia/Seoul",
      HKWasUserEntered: false,
    },
    events: [...lapEvents, ...pauseEvents],
    activities: [
      { uuid: uuid(), startDate, endDate, duration: totalDurationSec },
    ],
  };

  const payload = {
    workout,
    heartRateSamples,
    strokeCountSamples: strokeSamples,
    underwaterDepthSamples: [],
    waterTemperatureSamples: [],
  };

  const summary: SeedSummary = {
    poolLength,
    totalLaps,
    totalDistance,
    duration: totalDurationSec,
    calories,
    strokes: strokeTotals,
    startDate,
    endDate,
  };

  return { payload, summary };
}

function buildStrokeSample(
  strokeStyle: number,
  quantity: number,
  startMs: number,
  endMs: number,
  device: unknown,
  sourceRevision: unknown,
) {
  return {
    uuid: uuid(),
    startDate: fmtKst(startMs),
    endDate: fmtKst(endMs),
    quantity,
    quantityType: "HKQuantityTypeIdentifierSwimmingStrokeCount",
    unit: "count",
    metadata: { HKSwimmingStrokeStyle: strokeStyle },
    device,
    sourceRevision,
  };
}

export function buildRequestBody(payloads: { workout: unknown }[]) {
  return {
    items: payloads,
    syncContext: {
      distanceUnit: "METER",
      timezone: "Asia/Seoul",
      backfill: true,
    },
  };
}
