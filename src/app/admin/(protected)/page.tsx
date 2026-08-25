import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getTodayDashboardStats } from "@/lib/admin-queries";
import { todayInTokyo, formatTokyoDateTime } from "@/lib/date";
import { RpgPanel, RpgTitleBar } from "@/components/rpg/rpg-panel";
function tokyoDayRangeIso(dateStr: string){const start=new Date(`${dateStr}T00:00:00+09:00`);const end=new Date(start.getTime()+24*60*60*1000);return{startIso:start.toISOString(),endIso:end.toISOString()};}
export default async function AdminDashboardPage() {
  const { profile } = await requireAdmin();
  const supabase = await createClient();
  const{startIso,endIso}=tokyoDayRangeIso(todayInTokyo());
  const stats=await getTodayDashboardStats(startIso,endIso);
  const{data:recentQuests}=await supabase.from("quests").select("id,title,status,scheduled_at,expires_at").order("scheduled_at",{ascending:false}).limit(5);
  const STATUS_LABEL: Record<string,string>={draft:"下書き",scheduled:"予約済み",published:"配信済み",stopped:"停止"};
  const statCards=[{label:"本日の配信数",value:stats.todayDeliveredCount.toString()},{label:"本日の参加率",value:`${Math.round(stats.todayParticipationRate*100)}%`},{label:"本日の達成率",value:`${Math.round(stats.todayAchievementRate*100)}%`}];
  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="pixel-font text-xl text-[color:var(--rpg-gold-bright)]">ダッシュボード</h1><p className="mt-1 text-sm text-[color:var(--rpg-text-muted)]">ようこそ、{profile.nickname} さん</p></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map(card=><RpgPanel key={card.label}><div className="px-4 py-5"><p className="text-xs text-[color:var(--rpg-text-muted)]">{card.label}</p><p className="pixel-font mt-2 text-3xl text-[color:var(--rpg-gold-bright)]">{card.value}</p></div></RpgPanel>)}
      </div>
      <RpgPanel>
        <RpgTitleBar>最近配信したクエスト</RpgTitleBar>
        <div className="flex flex-col gap-2 p-4">
          {(recentQuests??[]).length===0?<p className="text-sm text-[color:var(--rpg-text-muted)]">まだクエストが作成されていません。</p>:
          (recentQuests??[]).map(q=>(
            <div key={q.id} className="flex items-center justify-between rounded-lg border border-[color:var(--rpg-gold)]/30 bg-[color:var(--rpg-navy-light)] px-4 py-3">
              <div><p className="text-sm font-bold text-[color:var(--rpg-text-light)]">{q.title}</p><p className="text-xs text-[color:var(--rpg-text-muted)]">{formatTokyoDateTime(q.scheduled_at)} 〜 {formatTokyoDateTime(q.expires_at)}</p></div>
              <span className="rpg-button rpg-button-secondary px-3 py-1 text-xs">{STATUS_LABEL[q.status]}</span>
            </div>
          ))}
        </div>
      </RpgPanel>
    </div>
  );
}
