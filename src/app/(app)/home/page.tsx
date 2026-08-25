import Link from "next/link";
import { ChevronRight, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { todayInTokyo } from "@/lib/date";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/quest-category";
import { RpgPanel, RpgTitleBar } from "@/components/rpg/rpg-panel";
import { StatusBar } from "@/components/rpg/status-bar";
export default async function HomePage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data: activeQuests } = await supabase.from("quests").select("*").eq("status","published").lte("scheduled_at",nowIso).gt("expires_at",nowIso).order("scheduled_at",{ascending:false}).limit(1);
  const activeQuest = activeQuests?.[0]??null;
  let isActiveQuestCompleted = false;
  if(activeQuest){const{data:completion}=await supabase.from("quest_completions").select("id").eq("quest_id",activeQuest.id).eq("user_id",profile.id).maybeSingle();isActiveQuestCompleted=Boolean(completion);}
  const { data: dailyQuests } = await supabase.from("daily_quests").select("*").eq("is_active",true).order("sort_order",{ascending:true});
  const today=todayInTokyo();
  const { data: dailyCompletions } = await supabase.from("daily_quest_completions").select("daily_quest_id").eq("completed_date",today);
  const completedDailyIds=new Set((dailyCompletions??[]).map(c=>c.daily_quest_id));
  const { data: pointsRows } = await supabase.from("points_ledger").select("points").eq("user_id",profile.id).eq("is_reversed",false);
  const totalPoints=(pointsRows??[]).reduce((sum,row)=>sum+row.points,0);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <StatusBar totalPoints={totalPoints}/>
        <Link href="/notifications/permission" className="ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[color:var(--rpg-gold)] bg-[color:var(--rpg-navy-light)] text-[color:var(--rpg-gold-bright)]" aria-label="通知設定"><Bell className="h-5 w-5"/></Link>
      </div>
      <RpgPanel>
        <RpgTitleBar>今すぐクエスト</RpgTitleBar>
        <div className="p-4">
          {activeQuest?(
            <Link href={`/quests/${activeQuest.id}`} className="flex items-center gap-3 rounded-lg border border-[color:var(--rpg-gold)]/40 bg-[color:var(--rpg-navy-light)] p-3">
              <div className="flex-1"><p className="text-sm font-bold text-[color:var(--rpg-text-light)]">{activeQuest.title}</p><p className="mt-0.5 text-xs text-[color:var(--rpg-text-muted)]">{isActiveQuestCompleted?"完了済み":`約${activeQuest.duration_seconds}秒・+${activeQuest.points} CP`}</p></div>
              <ChevronRight className="h-5 w-5 text-[color:var(--rpg-gold)]"/>
            </Link>
          ):<p className="text-center text-sm text-[color:var(--rpg-text-muted)]">今は配信中の「今すぐクエスト」はありません。<br/>届いたら通知でお知らせします。</p>}
        </div>
      </RpgPanel>
      <RpgPanel>
        <RpgTitleBar>デイリーミッション</RpgTitleBar>
        <div className="flex flex-col gap-2 p-3">
          <p className="px-1 text-xs text-[color:var(--rpg-text-muted)]">本日 {(dailyQuests??[]).filter(q=>completedDailyIds.has(q.id)).length} / {dailyQuests?.length??0} 件完了</p>
          {(dailyQuests??[]).map(quest=>{
            const Icon=CATEGORY_ICONS[quest.category]; const isDone=completedDailyIds.has(quest.id);
            return (
              <div key={quest.id} className="flex items-center gap-3 rounded-lg bg-[color:var(--rpg-cream)] px-3 py-2.5 text-[#3a2c14]">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isDone?"bg-[color:var(--rpg-green)] text-white":"bg-[color:var(--rpg-gold)]/40"}`}><Icon className="h-4 w-4"/></div>
                <div className="flex-1"><p className="text-sm font-bold">{quest.title}</p><p className="text-xs opacity-70">{CATEGORY_LABELS[quest.category]} ・ +{quest.points} CP</p></div>
                {isDone?<span className="text-xs font-bold text-[color:var(--rpg-green)]">完了</span>:<Link href="/quests"><span className="rpg-button rpg-button-primary px-3 py-1.5 text-xs">記録する</span></Link>}
              </div>
            );
          })}
        </div>
      </RpgPanel>
    </div>
  );
}
