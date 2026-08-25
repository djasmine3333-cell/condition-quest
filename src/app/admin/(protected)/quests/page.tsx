import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { formatTokyoDateTime } from "@/lib/date";
import { getQuestCompletionCounts, getTotalEmployeeCount } from "@/lib/admin-queries";
import { RpgPanel } from "@/components/rpg/rpg-panel";
import { RpgButton } from "@/components/rpg/rpg-button";
const STATUS_LABEL: Record<string,string>={draft:"下書き",scheduled:"予約済み",published:"配信済み",stopped:"停止"};
export default async function AdminQuestsPage() {
  await requireAdmin();
  const supabase=await createClient();
  const{data:quests}=await supabase.from("quests").select("*").order("scheduled_at",{ascending:false});
  const questIds=(quests??[]).map(q=>q.id);
  const completionCounts=await getQuestCompletionCounts(questIds);
  const totalEmployees=await getTotalEmployeeCount();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="pixel-font text-xl text-[color:var(--rpg-gold-bright)]">クエスト管理</h1>
        <Link href="/admin/quests/new"><RpgButton type="button" className="h-11 w-auto px-5 text-sm"><Plus className="h-4 w-4"/>新規作成</RpgButton></Link>
      </div>
      <div className="flex flex-col gap-2">
        {(quests??[]).length===0?<RpgPanel><p className="px-4 py-8 text-center text-sm text-[color:var(--rpg-text-muted)]">まだクエストが作成されていません。</p></RpgPanel>:
        (quests??[]).map(quest=>{
          const completions=completionCounts[quest.id]??0;
          const rate=totalEmployees>0?Math.round((completions/totalEmployees)*100):0;
          return (
            <Link key={quest.id} href={`/admin/quests/${quest.id}/edit`}>
              <RpgPanel className="transition-opacity hover:opacity-90">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1"><div className="mb-1 flex items-center gap-2"><span className="rpg-button rpg-button-secondary px-2 py-0.5 text-[10px]">{STATUS_LABEL[quest.status]}</span><span className="truncate text-sm font-bold text-[color:var(--rpg-text-light)]">{quest.title}</span></div><p className="text-xs text-[color:var(--rpg-text-muted)]">{formatTokyoDateTime(quest.scheduled_at)} 〜 {formatTokyoDateTime(quest.expires_at)}</p></div>
                  <div className="shrink-0 text-right"><p className="pixel-font text-sm text-[color:var(--rpg-gold-bright)]">達成率 {rate}%</p><p className="text-xs text-[color:var(--rpg-text-muted)]">{completions}人完了</p></div>
                </div>
              </RpgPanel>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
