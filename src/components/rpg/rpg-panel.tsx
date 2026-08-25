import { cn } from "@/lib/utils";
export function RpgPanel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rpg-panel", className)}><div className="rpg-panel-inner">{children}</div></div>;
}
export function RpgTitleBar({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rpg-title-bar pixel-font flex items-center justify-center gap-2 px-4 py-2.5 text-sm tracking-wide", className)}>{children}</div>;
}
