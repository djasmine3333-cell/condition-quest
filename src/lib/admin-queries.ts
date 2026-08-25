import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
export async function getTotalEmployeeCount(): Promise<number> {
  const supabase=createAdminClient();
  const{count}=await supabase.from("profiles").select("id",{count:"exact",head:true}).eq("role","employee");
  return count??0;
}
export async function getQuestCompletionCounts(questIds: string[]): Promise<Record<string,number>> {
  if(questIds.length===0)return{};
  const supabase=createAdminClient();
  const{data}=await supabase.from("quest_completions").select("quest_id").in("quest_id",questIds);
  const counts: Record<string,number>={};
  for(const row of data??[]){counts[row.quest_id]=(counts[row.quest_id]??0)+1;}
  return counts;
}
export async function getTodayDashboardStats(todayStartIso: string, todayEndIso: string) {
  const supabase=createAdminClient();
  const{data:todaysQuests}=await supabase.from("quests").select("id").gte("scheduled_at",todayStartIso).lt("scheduled_at",todayEndIso).in("status",["published","stopped"]);
  const questIds=(todaysQuests??[]).map(q=>q.id);
  const totalEmployees=await getTotalEmployeeCount();
  if(questIds.length===0||totalEmployees===0)return{todayDeliveredCount:questIds.length,todayParticipationRate:0,todayAchievementRate:0};
  const counts=await getQuestCompletionCounts(questIds);
  const totalCompletions=Object.values(counts).reduce((sum,c)=>sum+c,0);
  const maxPossible=questIds.length*totalEmployees;
  const rate=maxPossible>0?totalCompletions/maxPossible:0;
  return{todayDeliveredCount:questIds.length,todayParticipationRate:rate,todayAchievementRate:rate};
}
