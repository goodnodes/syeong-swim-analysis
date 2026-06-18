import { Layout } from "@/components/Layout";
import { ClassResultView } from "@/components/ClassResultView";
import { useClassResult } from "@/class/useClassResult";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function Result() {
  const [, setLocation] = useLocation();
  const state = useClassResult();

  return (
    <Layout>
      {state.status === "ready" ? (
        <ClassResultView result={state.result} onHome={() => setLocation("/")} />
      ) : state.status === "error" ? (
        <div className="min-h-[calc(100dvh-72px)] flex flex-col items-center justify-center gap-5 px-8 text-center">
          <p className="text-sm text-muted-foreground">{state.message}</p>
          <button
            onClick={() => setLocation("/")}
            className="rounded-xl bg-primary text-primary-foreground px-6 py-3 font-bold"
          >
            홈으로
          </button>
        </div>
      ) : (
        <div className="min-h-[calc(100dvh-72px)] flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
        </div>
      )}
    </Layout>
  );
}
