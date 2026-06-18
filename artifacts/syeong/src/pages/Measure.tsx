import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { currentUser } from "@/data/mock";
import { Waves, CheckCircle2 } from "lucide-react";

export default function Measure() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<number>(() => {
    // 홈의 "내 실력 측정" 버튼에서 진입하면 시작 화면을 건너뛰고 바로 측정 시작
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("start") === "1") return 1;
    }
    return 0;
  }); // 0: start, 1: measuring, 2: result
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 1) {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(2), 500);
            return 100;
          }
          return p + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [step]);

  return (
    <Layout>
      <div className="h-full min-h-[calc(100vh-72px)] flex flex-col bg-white">
        
        {step === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
              <Waves className="w-16 h-16 text-primary animate-pulse" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-4">
              실력 측정하기
            </h1>
            <p className="text-gray-500 mb-12 text-sm max-w-[240px]">
              나의 최근 기록을 바탕으로 현재의 수영 실력을 정확하게 분석합니다.
            </p>
            <button 
              onClick={() => setStep(1)}
              className="w-full max-w-[280px] bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-blue-600 transition-colors active:scale-95"
            >
              측정 시작
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <h2 className="text-5xl font-black text-primary mb-8 tracking-tighter">
              {progress}%
            </h2>
            
            {/* Mascot / Visual */}
            <div className="relative w-48 h-48 mb-12">
              <div className="absolute inset-0 border-8 border-gray-100 rounded-full" />
              <div 
                className="absolute inset-0 border-8 border-primary rounded-full transition-all duration-75 ease-linear"
                style={{ 
                  clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`
                }} 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Waves className={`w-12 h-12 text-primary ${progress % 20 < 10 ? 'translate-y-2' : '-translate-y-2'} transition-transform duration-300`} />
              </div>
            </div>

            <p className="text-lg font-bold text-gray-700 animate-pulse">
              {progress < 30 ? "최근 영법 기록 불러오는 중..." : 
               progress < 70 ? "비슷한 실력자 데이터와 비교 중..." : 
               "최종 등급 계산 중..."}
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col bg-gray-50 animate-in slide-in-from-bottom-8 fade-in duration-700">
            <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white p-8 pt-16 rounded-b-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1vcGFjaXR5PSIwLjEiPjwvcGF0aD4KPC9zdmc+')] opacity-20" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  분석 완료
                </div>
                
                <h2 className="text-xl text-gray-300 font-medium mb-1">추정 실력 등급</h2>
                <div className="text-5xl font-black mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  {currentUser.level}
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300 font-medium">대한민국 상위</span>
                    <span className="text-2xl font-bold text-white">{currentUser.percentile}%</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300 font-medium">예상 50m 자유형</span>
                    <span className="text-2xl font-bold text-white">{currentUser.best50m.freestyle}초</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 mt-auto">
              <button 
                onClick={() => setLocation("/")}
                className="w-full bg-white text-gray-900 border border-gray-200 py-4 rounded-2xl font-bold text-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
