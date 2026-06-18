import { Layout } from "@/components/Layout";
import { Logo } from "@/components/Logo";
import { useLocation } from "wouter";
import { shadow } from "@/theme/tokens";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <div className="min-h-[calc(100dvh-72px)] flex flex-col items-center justify-center px-8">
        <Logo size={116} />
        <button
          onClick={() => setLocation("/measure?start=1")}
          className="mt-10 w-full rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold transition-transform active:scale-[0.98]"
          style={{ boxShadow: shadow.brand }}
        >
          내 실력 측정
        </button>
      </div>
    </Layout>
  );
}
