import { Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { RpgPanel, RpgTitleBar } from "@/components/rpg/rpg-panel";
import { RankingPodium } from "@/components/rpg/ranking-podium";
export default async function PointsPage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const { data: pointsRows } = await supabase.from("points_ledger").select("points").eq("user_id",profile.id).eq("is_reversed",false);
  const totalPoints=(pointsRows??[]).reduce((sum,row)=>sum+row.points,0);
  const { data: ranking } = await supabase.rpc("get_weekly_ranking");
  const top3=(ranking??[]).filter(r=>r.rank<=3);
  const selfRow=(ranking??[]).find(r=>r.is_current_user);
  return (
    <div className="flex flex-col gap-5">
      <RpgTitleBar>ポイント・ランキング</RpgTitleBar>
      <RpgPanel>
        <div className="flex items-center justify-center gap-2 px-4 pt-4"><Trophy className="h-5 w-5 text-[color:var(--rpg-gold-bright)]"/><h2 className="pixel-font text-sm text-[color:var(--rpg-gold-bright)]">今週のランキング</h2></div>
        {top3.length===0?<p className="px-4 py-6 text-center text-sm text-[color:var(--rpg-text-muted)]">まだ今週の獲得CPがありません。</p>:<RankingPodium entries={top3}/>}
        <div className="mx-4 mb-4 mt-2 rounded-lg border border-[color:var(--rpg-gold)]/40 bg-[color:var(--rpg-navy-light)] p-3">
          <p className="mb-1 text-xs text-[color:var(--rpg-text-muted)]">自分の順位</p>
          <div className="flex items-center justify-between"><span className="text-sm font-bold text-[color:var(--rpg-text-light)]">{profile.nickname}</span><span className="pixel-font text-base text-[color:var(--rpg-gold-bright)]">{(selfRow?.total_points??0).toLocaleString()} CP</span></div>
          {selfRow&&<p className="mt-1 text-xs text-[color:var(--rpg-text-muted)]">今週の順位: {selfRow.rank}位</p>}
        </div>
      </RpgPanel>
      <RpgPanel>
        <RpgTitleBar>あなたの累計CP</RpgTitleBar>
        <div className="flex items-center justify-center gap-3 px-4 py-6"><span className="pixel-font text-3xl text-[color:var(--rpg-gold-bright)]">{totalPoints.toLocaleString()}</span><span className="text-sm text-[color:var(--rpg-text-muted)]">CP</span></div>
      </RpgPanel>
    </div>
  );
}
