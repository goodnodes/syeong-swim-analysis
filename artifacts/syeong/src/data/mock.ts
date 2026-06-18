export const levels = [
  "신기초", "기초1", 
  "초급1", "초급2", "초급3", 
  "중급1", "중급2", "중급3", 
  "상급1", "상급2", "상급3", 
  "고급", "연수"
];

export const strokes = ["자유형", "배영", "평영", "접영"];

export const currentUser = {
  id: "u1",
  name: "지훈",
  level: "중급2",
  percentile: 12.5,
  totalSessions: 142,
  totalDistance: 125000,
  focus: "평영 발차기",
  best50m: {
    freestyle: 34.2,
    backstroke: 41.5,
    breaststroke: 45.1,
    butterfly: 38.7
  },
  recentSessions: [
    { date: "2024-05-12", distance: 1500, stroke: "자유형", duration: 45 },
    { date: "2024-05-10", distance: 1200, stroke: "평영", duration: 40 },
    { date: "2024-05-08", distance: 1800, stroke: "자유형", duration: 50 },
    { date: "2024-05-05", distance: 1000, stroke: "접영", duration: 35 },
  ],
  weeklyTrends: [
    { week: "4월 2주", distance: 4500 },
    { week: "4월 3주", distance: 5200 },
    { week: "4월 4주", distance: 4800 },
    { week: "5월 1주", distance: 6000 },
    { week: "5월 2주", distance: 5500 },
  ],
  strokeBreakdown: [
    { name: "자유형", value: 60 },
    { name: "평영", value: 20 },
    { name: "배영", value: 10 },
    { name: "접영", value: 10 },
  ],
  levelHistory: [
    { date: "2023-08", level: "초급1" },
    { date: "2023-11", level: "초급3" },
    { date: "2024-02", level: "중급1" },
    { date: "2024-05", level: "중급2" },
  ]
};

export const peers = [
  { id: "p1", name: "민수", level: "중급3", percentile: 8.2, distance: 140000, best50m: 32.1 },
  { id: "p2", name: "서연", level: "중급2", percentile: 11.0, distance: 128000, best50m: 33.5 },
  { id: "p3", name: "지훈 (나)", level: "중급2", percentile: 12.5, distance: 125000, best50m: 34.2, isMe: true },
  { id: "p4", name: "태현", level: "중급1", percentile: 15.3, distance: 110000, best50m: 36.0 },
  { id: "p5", name: "수진", level: "초급3", percentile: 22.1, distance: 95000, best50m: 39.5 },
  { id: "p6", name: "동석", level: "초급3", percentile: 25.4, distance: 88000, best50m: 41.2 },
];

export const distributionData = [
  { level: "기초", percentage: 15 },
  { level: "초급", percentage: 35 },
  { level: "중급", percentage: 30, isUser: true },
  { level: "상급", percentage: 15 },
  { level: "고급", percentage: 4 },
  { level: "연수", percentage: 1 },
];

// Deterministic PRNG (mulberry32) so the heatmap is stable across renders/reloads.
function seededRandom(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateHeatmapData() {
  const data = [];
  const today = new Date();
  const rand = seededRandom(20260618);
  for (let i = 0; i < 300; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    // ~30% chance of a swimming day, deterministic across loads
    const isSwimming = rand() < 0.3;
    const distance = isSwimming ? Math.floor(rand() * 2000) + 500 : 0;

    data.push({
      date: date.toISOString().split('T')[0],
      distance,
      count: isSwimming ? Math.ceil(distance / 500) : 0
    });
  }
  return data.reverse();
}
