import { shadow } from "@/theme/tokens";
import logoUrl from "@assets/Syeong_logo_1781762686397.png";

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
}

export function Logo({ size = 104, showWordmark = true }: LogoProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative flex items-center justify-center rounded-[28px] bg-white"
        style={{
          width: size,
          height: size,
          boxShadow: shadow.brand,
        }}
      >
        <img
          src={logoUrl}
          alt="Syeong"
          className="relative"
          style={{ width: size * 0.78, height: size * 0.78 }}
        />
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
