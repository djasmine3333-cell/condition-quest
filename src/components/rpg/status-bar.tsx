import { HeroPixelIcon } from "@/components/rpg/hero-pixel-icon";
export function calculateLevel(totalPoints: number) {
  const expForNextLevel = 100;
  const level = Math.floor(totalPoints/expForNextLevel)+1;
  const expIntoLevel = totalPoints%expForNextLevel;
  return { level, expIntoLevel, expForNextLevel };
}
export function StatusBar({ totalPoints }: { totalPoints: number }) {
  const { level, expIntoLevel, expForNextLevel } = calculateLevel(totalPoints);
  const progress = Math.round((expIntoLevel/expForNextLevel)*100);
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-[color:var(--rpg-gold)] bg-[color:var(--rpg-navy-light)]">
        <HeroPixelIcon className="h-9 w-9"/>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="pixel-font text-sm text-[color:var(--rpg-text-light)]">勇者 Lv.{level}</span>
          <span className="pixel-font text-sm text-[color:var(--rpg-gold-bright)]">{totalPoints.toLocaleString()} CP</span>
        </div>
        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full border border-[color:var(--rpg-gold)] bg-[color:var(--rpg-navy-deep)]">
          <div className="h-full bg-gradient-to-r from-sky-400 to-sky-300" style={{width:`${progress}%`}}/>
        </div>
      </div>
    </div>
  );
}
