import { HeroPixelIcon } from "@/components/rpg/hero-pixel-icon";
interface PodiumEntry { rank: number; nickname: string; total_points: number; }
const PODIUM_HEIGHT: Record<number,string> = {1:"h-24",2:"h-16",3:"h-12"};
const PODIUM_COLOR: Record<number,string> = {1:"bg-gradient-to-b from-[#e8b84b] to-[#b5862a]",2:"bg-gradient-to-b from-[#9fb6c9] to-[#5d7387]",3:"bg-gradient-to-b from-[#c98a4f] to-[#8a5a2e]"};
export function RankingPodium({ entries }: { entries: PodiumEntry[] }) {
  const first=entries.find(e=>e.rank===1), second=entries.find(e=>e.rank===2), third=entries.find(e=>e.rank===3);
  const ordered=[second,first,third];
  return (
    <div className="flex items-end justify-center gap-3 px-2 pb-2 pt-4">
      {ordered.map((entry,idx)=>{
        if(!entry) return <div key={idx} className="w-20"/>;
        return (
          <div key={entry.rank} className="flex w-20 flex-col items-center gap-1.5">
            {entry.rank===1&&<span className="text-xl text-[color:var(--rpg-gold-bright)]">★</span>}
            <HeroPixelIcon className="h-10 w-10"/>
            <p className="w-full truncate text-center text-xs font-bold text-[color:var(--rpg-text-light)]">{entry.nickname}</p>
            <div className={`flex w-full flex-col items-center justify-start rounded-t-md border-2 border-b-0 border-[color:var(--rpg-gold)] pt-1 ${PODIUM_HEIGHT[entry.rank]} ${PODIUM_COLOR[entry.rank]}`}>
              <span className="pixel-font text-lg text-white drop-shadow">{entry.rank}</span>
            </div>
            <p className="-mt-0.5 text-[11px] font-bold text-[color:var(--rpg-gold-bright)]">{entry.total_points.toLocaleString()} CP</p>
          </div>
        );
      })}
    </div>
  );
}
