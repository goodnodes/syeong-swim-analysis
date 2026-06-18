import { gradients, shadow } from "@/theme/tokens";

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
}

export function Logo({ size = 104, showWordmark = true }: LogoProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative flex items-center justify-center rounded-[28px]"
        style={{
          width: size,
          height: size,
          backgroundImage: gradients.brandPro,
          boxShadow: shadow.brand,
        }}
      >
        <div className="absolute inset-0 rounded-[28px] bg-white/10 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <svg
          viewBox="0 0 64 64"
          fill="none"
          className="relative"
          style={{ width: size * 0.62, height: size * 0.62 }}
        >
          <path
            d="M4 24c5 0 5 5 10 5s5-5 10-5 5 5 10 5 5-5 10-5 5 5 10 5"
            stroke="white"
            strokeOpacity="0.5"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M4 36c5 0 5 5 10 5s5-5 10-5 5 5 10 5 5-5 10-5 5 5 10 5"
            stroke="white"
            strokeOpacity="0.75"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M4 48c5 0 5 5 10 5s5-5 10-5 5 5 10 5 5-5 10-5 5 5 10 5"
            stroke="white"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showWordmark && (
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-foreground">Syeong</h1>
          <p className="mt-1.5 text-sm font-medium tracking-wide text-muted-foreground">
            수영 실력 분석
          </p>
        </div>
      )}
    </div>
  );
}
