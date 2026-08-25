"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
export interface CompleteQuestResult { success: boolean; pointsAwarded: number; message: string; }
export async function completeInstantQuestAction(questId: string): Promise<CompleteQuestResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("complete_instant_quest", { p_quest_id: questId });
  if (error || !data || data.length===0) return { success:false, pointsAwarded:0, message:"通信エラーが発生しました" };
  const result = data[0];
  revalidatePath("/home"); revalidatePath("/quests"); revalidatePath("/points"); revalidatePath("/history");
  return { success:result.success, pointsAwarded:result.points_awarded, message:result.message };
}
export async function completeDailyQuestAction(dailyQuestId: string): Promise<CompleteQuestResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("complete_daily_quest", { p_daily_quest_id: dailyQuestId });
  if (error || !data || data.length===0) return { success:false, pointsAwarded:0, message:"通信エラーが発生しました" };
  const result = data[0];
  revalidatePath("/home"); revalidatePath("/quests"); revalidatePath("/points"); revalidatePath("/history");
  return { success:result.success, pointsAwarded:result.points_awarded, message:result.message };
}
