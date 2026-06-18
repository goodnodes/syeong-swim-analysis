import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currentUser, generateHeatmapData } from "@/data/mock";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, CartesianGrid } from "recharts";
import { useMemo } from "react";
import { Activity, Clock, TrendingUp } from "lucide-react";

export default function Analysis() {
  const heatmapData = useMemo(() => generateHeatmapData(), []);

  return (
    <Layout>
      <div className="p-5 flex flex-col gap-6">
        <header className="pt-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">분석 통계</h1>
          <p className="text-sm text-gray-500 mt-1">최근 나의 수영 기록을 한눈에 확인하세요.</p>
        </header>

        <Tabs defaultValue="period" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="period" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">기간별</TabsTrigger>
            <TabsTrigger value="stroke" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">영법별</TabsTrigger>
            <TabsTrigger value="level" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">실력</TabsTrigger>
          </TabsList>

          {/* Period Tab */}
          <TabsContent value="period" className="mt-6 space-y-6">
            <div className="flex gap-2">
              {['주', '월', '년', '전체'].map((period, i) => (
                <button key={i} className={`px-4 py-1.5 rounded-full text-xs font-medium ${i === 0 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {period}
                </button>
              ))}
            </div>

            <Card className="border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">주간 운동량 변화</h3>
                    <p className="text-xs text-gray-500">최근 5주 기준</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentUser.weeklyTrends} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="distance" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorDistance)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            <Card className="border-gray-100 shadow-sm">
              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 mb-1">연간 수영 기록</h3>
                <p className="text-xs text-gray-500 mb-4">꾸준함이 실력을 만듭니다.</p>
                
                <div className="grid grid-cols-10 gap-1 overflow-x-auto pb-2">
                  {heatmapData.slice(-100).map((day, i) => (
                    <div 
                      key={i} 
                      className={`w-4 h-4 rounded-sm ${day.count === 0 ? 'bg-gray-100' : day.count === 1 ? 'bg-blue-200' : day.count === 2 ? 'bg-blue-400' : day.count === 3 ? 'bg-blue-500' : 'bg-blue-600'}`}
                      title={`${day.date}: ${day.distance}m`}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Stroke Tab */}
          <TabsContent value="stroke" className="mt-6 space-y-6">
            <Card className="border-gray-100 shadow-sm">
              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 mb-4">영법별 훈련 비율</h3>
                <div className="flex gap-4 items-center">
                  <div className="w-[120px] h-[120px] rounded-full border-[16px] border-gray-100 relative mx-auto my-4 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="16" strokeDasharray="264" strokeDashoffset="105" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--accent))" strokeWidth="16" strokeDasharray="264" strokeDashoffset="220" />
                    </svg>
                    <div className="text-center">
                      <div className="text-2xl font-bold">60%</div>
                      <div className="text-[10px] text-gray-500">자유형</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    {currentUser.strokeBreakdown.map((stroke, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-accent' : i === 2 ? 'bg-secondary' : 'bg-gray-300'}`} />
                          <span className="text-sm font-medium">{stroke.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{stroke.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <h3 className="font-bold text-gray-900 mt-8 mb-4">영법별 50m 최고 기록</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "자유형", time: currentUser.best50m.freestyle, color: "text-blue-600", bg: "bg-blue-50" },
                { name: "배영", time: currentUser.best50m.backstroke, color: "text-indigo-600", bg: "bg-indigo-50" },
                { name: "평영", time: currentUser.best50m.breaststroke, color: "text-teal-600", bg: "bg-teal-50" },
                { name: "접영", time: currentUser.best50m.butterfly, color: "text-sky-600", bg: "bg-sky-50" },
              ].map((stroke, i) => (
                <Card key={i} className="border-gray-100 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-700">{stroke.name}</span>
                      <div className={`w-6 h-6 rounded-full ${stroke.bg} ${stroke.color} flex items-center justify-center`}>
                        <Clock className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-xl font-bold text-gray-900">{stroke.time}</span>
                      <span className="text-xs text-gray-500 mb-1">초</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Level Tab */}
          <TabsContent value="level" className="mt-6 space-y-6">
            <Card className="border-gray-100 shadow-sm">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900">나의 실력 변천사</h3>
                  <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="relative pl-4 border-l-2 border-gray-100 space-y-6 mt-6">
                  {currentUser.levelHistory.map((history, i) => (
                    <div key={i} className="relative">
                      <div className={`absolute -left-[21px] w-3 h-3 rounded-full ${i === currentUser.levelHistory.length - 1 ? 'bg-primary border-2 border-white' : 'bg-gray-300 border-2 border-white'}`} />
                      <div className="flex justify-between items-center -mt-1">
                        <div>
                          <div className="font-bold text-gray-900">{history.level}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{history.date} 승급</div>
                        </div>
                        {i === currentUser.levelHistory.length - 1 && (
                          <div className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                            현재
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
