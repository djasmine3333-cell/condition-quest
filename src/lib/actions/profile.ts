"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
export async function updateNotificationSettingAction(enabled: boolean) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: "ログインが必要です" };
  const { error } = await supabase.from("profiles").update({ notification_enabled: enabled }).eq("id", userData.user.id);
  if (error) return { error: "設定の更新に失敗しました" };
  revalidatePath("/mypage"); return { error: undefined };
}
export async function updateRankingOptInAction(optIn: boolean) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: "ログインが必要です" };
  const { error } = await supabase.from("profiles").update({ ranking_opt_in: optIn }).eq("id", userData.user.id);
  if (error) return { error: "設定の更新に失敗しました" };
  revalidatePath("/mypage"); revalidatePath("/points"); return { error: undefined };
}
