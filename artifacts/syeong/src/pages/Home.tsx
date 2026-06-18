import { Layout } from "@/components/Layout";
import { Logo } from "@/components/Logo";
import { useLocation } from "wouter";
import { shadow } from "@/theme/tokens";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <div className="min-h-[calc(100dvh-72px)] flex flex-col items-center px-8">
        <div className="flex-1 flex items-center justify-center">
          <Logo size={116} />
        </div>

        <div className="w-full pb-10">
          <button
            onClick={() => setLocation("/measure?start=1")}
            className="w-full rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold transition-transform active:scale-[0.98]"
            style={{ boxShadow: shadow.brand }}
          >
            내 실력 측정
          </button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            버튼을 누르면 바로 측정이 시작됩니다
          </p>
        </div>
      </div>
    </Layout>
  );
}
