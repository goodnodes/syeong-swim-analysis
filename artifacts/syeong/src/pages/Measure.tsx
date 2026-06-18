import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ClassResultView } from "@/components/ClassResultView";
import { classResult } from "@/data/classMock";
import { Waves } from "lucide-react";

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
          <ClassResultView result={classResult} onHome={() => setLocation("/")} />
        )}

      </div>
    </Layout>
  );
}
