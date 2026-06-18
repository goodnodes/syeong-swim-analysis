import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { currentUser, peers, distributionData } from "@/data/mock";
import { Crown, Trophy, Users } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";

export default function Compare() {
  const sortedPeers = [...peers].sort((a, b) => b.distance - a.distance);

  return (
    <Layout>
      <div className="p-5 flex flex-col gap-6">
        <header className="pt-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">비교 및 랭킹</h1>
          <p className="text-sm text-gray-500 mt-1">나와 비슷한 실력의 수영인들과 비교해보세요.</p>
        </header>

        {/* Top Percentile Hero */}
        <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white border-none overflow-hidden relative shadow-xl">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-8 -translate-y-8">
            <Crown className="w-40 h-40" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="text-center">
              <div className="text-sm text-gray-400 font-medium mb-2">당신의 수영 실력은 대한민국</div>
              <div className="text-5xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                상위 {currentUser.percentile}%
              </div>
              <div className="text-sm text-gray-300">
                현재 <strong className="text-white">중급 구간</strong>에 속해있습니다.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribution Chart */}
        <Card className="border-gray-100 shadow-sm">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">전체 실력 분포</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="h-[140px] w-full mt-6 flex items-end gap-1 px-2">
              {distributionData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-300 ${d.isUser ? 'bg-primary' : 'bg-blue-100'}`}
                    style={{ height: `${d.percentage * 3}px` }}
                  >
                    {d.isUser && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded font-bold whitespace-nowrap">
                        나의 위치
                      </div>
                    )}
                  </div>
                  <div className={`text-xs ${d.isUser ? 'font-bold text-primary' : 'text-gray-500 font-medium'}`}>
                    {d.level}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Leaderboard */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">나의 또래 그룹 랭킹</h3>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">동일 연령대/성별</span>
          </div>

          <Card className="border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {sortedPeers.map((peer, i) => (
                <div 
                  key={peer.id} 
                  className={`flex items-center justify-between p-4 ${peer.isMe ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 text-center font-bold ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-700' : 'text-gray-400'}`}>
                      {i + 1}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                      {peer.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">
                        {peer.name} {peer.isMe && <span className="ml-1 text-primary text-xs">(나)</span>}
                      </div>
                      <div className="text-xs text-gray-500">{peer.level} • 상위 {peer.percentile}%</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-sm">{(peer.distance / 1000).toFixed(1)}km</div>
                    <div className="text-[10px] text-gray-500">총 누적</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </Layout>
  );
}
