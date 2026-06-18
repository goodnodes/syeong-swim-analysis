import { Link, useLocation } from "wouter";
import { Home, Timer, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "홈" },
    { href: "/measure", icon: Timer, label: "측정" },
    { href: "/seed", icon: Sprout, label: "시딩" },
  ];

  return (
    <div className="min-h-[100dvh] bg-gray-100 flex justify-center w-full">
      <div className="w-full max-w-[430px] bg-background min-h-[100dvh] relative shadow-2xl flex flex-col">
        <div className="flex-1 overflow-y-auto pb-[72px]">
          {children}
        </div>
        
        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-[72px] px-2 z-50">
          {navItems.map((item) => {
            const path = location.split("?")[0];
            const isActive = item.href === "/" ? path === "/" : path.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center justify-center gap-1">
                <div className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
                )}>
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-gray-400"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
