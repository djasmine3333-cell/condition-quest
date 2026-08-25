"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { tokyoLocalInputToUtcIso } from "@/lib/date";
import { questFormSchema, type QuestFormInput } from "@/lib/validations/quest";
export interface QuestActionResult { error?: string; }
async function checkOverlap(supabase: Awaited<ReturnType<typeof createClient>>, scheduledAtIso: string, expiresAtIso: string, excludeQuestId?: string): Promise<boolean> {
  let query = supabase.from("quests").select("id").in("status",["scheduled","published"]).lt("scheduled_at",expiresAtIso).gt("expires_at",scheduledAtIso);
  if (excludeQuestId) query = query.neq("id", excludeQuestId);
  const { data } = await query;
  return Boolean(data && data.length>0);
}
export async function createQuestAction(input: QuestFormInput): Promise<QuestActionResult> {
  const parsed = questFormSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください" };
  const { profile } = await requireAdmin();
  const supabase = await createClient();
  const scheduledAtIso = tokyoLocalInputToUtcIso(parsed.data.scheduledAtLocal);
  const expiresAtIso = tokyoLocalInputToUtcIso(parsed.data.expiresAtLocal);
  if (parsed.data.status!=="draft") { const hasOverlap = await checkOverlap(supabase, scheduledAtIso, expiresAtIso); if (hasOverlap) return { error:"表示時間帯が他のクエストと重複しています" }; }
  const { error } = await supabase.from("quests").insert({ title:parsed.data.title, description:parsed.data.description, category:parsed.data.category, duration_seconds:parsed.data.durationSeconds, points:parsed.data.points, scheduled_at:scheduledAtIso, expires_at:expiresAtIso, notification_title:parsed.data.notificationTitle, notification_body:parsed.data.notificationBody, status:parsed.data.status, created_by:profile.id });
  if (error) { if (error.message.includes("quests_no_overlapping")) return { error:"表示時間帯が重複しています" }; return { error:"クエストの作成に失敗しました" }; }
  revalidatePath("/admin/quests"); redirect("/admin/quests");
}
export async function updateQuestAction(questId: string, input: QuestFormInput): Promise<QuestActionResult> {
  const parsed = questFormSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください" };
  await requireAdmin();
  const supabase = await createClient();
  const scheduledAtIso = tokyoLocalInputToUtcIso(parsed.data.scheduledAtLocal);
  const expiresAtIso = tokyoLocalInputToUtcIso(parsed.data.expiresAtLocal);
  if (parsed.data.status!=="draft") { const hasOverlap = await checkOverlap(supabase, scheduledAtIso, expiresAtIso, questId); if (hasOverlap) return { error:"表示時間帯が重複しています" }; }
  const { error } = await supabase.from("quests").update({ title:parsed.data.title, description:parsed.data.description, category:parsed.data.category, duration_seconds:parsed.data.durationSeconds, points:parsed.data.points, scheduled_at:scheduledAtIso, expires_at:expiresAtIso, notification_title:parsed.data.notificationTitle, notification_body:parsed.data.notificationBody, status:parsed.data.status }).eq("id", questId);
  if (error) return { error:"クエストの更新に失敗しました" };
  revalidatePath("/admin/quests"); redirect("/admin/quests");
}
export async function deleteQuestAction(questId: string): Promise<QuestActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("quests").delete().eq("id", questId);
  if (error) return { error:"削除に失敗しました" };
  revalidatePath("/admin/quests"); return {};
}
export async function stopQuestAction(questId: string): Promise<QuestActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("quests").update({ status:"stopped" }).eq("id", questId);
  if (error) return { error:"公開停止に失敗しました" };
  revalidatePath("/admin/quests"); return {};
}
