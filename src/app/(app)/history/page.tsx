import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { formatTokyoDateTime } from "@/lib/date";
import { RpgPanel, RpgTitleBar } from "@/components/rpg/rpg-panel";
export default async function HistoryPage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const { data: instantCompletions } = await supabase.from("quest_completions").select("id, completed_at, quests(title, points)").eq("user_id",profile.id).order("completed_at",{ascending:false});
  const { data: dailyCompletions } = await supabase.from("daily_quest_completions").select("id, completed_at, daily_quests(title, points)").eq("user_id",profile.id).order("completed_at",{ascending:false});
  const items=[...(instantCompletions??[]).map(row=>({id:row.id,title:row.quests?.title??"(削除されたクエスト)",points:row.quests?.points??0,completedAt:row.completed_at})),...(dailyCompletions??[]).map(row=>({id:row.id,title:row.daily_quests?.title??"(削除されたクエスト)",points:row.daily_quests?.points??0,completedAt:row.completed_at}))].sort((a,b)=>new Date(b.completedAt).getTime()-new Date(a.completedAt).getTime());
  return (
    <div className="flex flex-col gap-5">
      <RpgTitleBar>達成履歴</RpgTitleBar>
      <RpgPanel>
        {items.length===0?<p className="px-4 py-8 text-center text-sm text-[color:var(--rpg-text-muted)]">まだ達成したクエストはありません。</p>:
        <div className="flex flex-col divide-y divide-[color:var(--rpg-gold)]/15 px-4">
          {items.map(item=>(
            <div key={item.id} className="flex items-center gap-3 py-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[color:var(--rpg-gold-bright)]"/>
              <div className="flex-1"><p className="text-sm font-medium text-[color:var(--rpg-text-light)]">{item.title}</p><p className="text-xs text-[color:var(--rpg-text-muted)]">{formatTokyoDateTime(item.completedAt)}</p></div>
              <span className="pixel-font text-sm text-[color:var(--rpg-gold-bright)]">+{item.points}</span>
            </div>
          ))}
        </div>}
      </RpgPanel>
    </div>
  );
}
