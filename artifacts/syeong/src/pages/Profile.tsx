import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Settings, ChevronRight, History, Waves } from "lucide-react";
import { currentUser } from "@/data/mock";

export default function Profile() {
  return (
    <Layout>
      <div className="p-5 flex flex-col gap-6 pb-12">
        {/* Profile Header */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-accent p-1 shadow-lg mb-4">
            <div className="w-full h-full rounded-full border-4 border-white bg-white flex items-center justify-center text-primary text-3xl font-black">
              {currentUser.name[0]}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{currentUser.name}</h1>
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
              {currentUser.level}
            </span>
            <span className="text-sm text-gray-500">수영 경력 10개월</span>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-none bg-blue-50">
            <CardContent className="p-4 text-center">
              <div className="text-xs text-blue-600 font-medium mb-1">총 세션</div>
              <div className="text-xl font-bold text-blue-900">{currentUser.totalSessions}</div>
            </CardContent>
          </Card>
          <Card className="border-none bg-indigo-50">
            <CardContent className="p-4 text-center">
              <div className="text-xs text-indigo-600 font-medium mb-1">상위</div>
              <div className="text-xl font-bold text-indigo-900">{currentUser.percentile}%</div>
            </CardContent>
          </Card>
          <Card className="border-none bg-cyan-50">
            <CardContent className="p-4 text-center">
              <div className="text-xs text-cyan-600 font-medium mb-1">거리(km)</div>
              <div className="text-xl font-bold text-cyan-900">{(currentUser.totalDistance / 1000).toFixed(0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Menu List */}
        <div className="space-y-4 mt-2">
          
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">나의 기록</h3>
            <Card className="border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                      <History className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-700 text-sm">수영 일지 전체보기</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-700 text-sm">획득한 뱃지 및 트로피</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </Card>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">설정</h3>
            <Card className="border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                      <Settings className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-700 text-sm">앱 설정</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                      <Waves className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-700 text-sm">목표 설정</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </Layout>
  );
}
