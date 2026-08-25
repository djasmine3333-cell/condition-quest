import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { QuestForm } from "@/components/admin/quest-form";
export default async function EditQuestPage({ params }: { params: Promise<{id:string}> }) {
  const{id}=await params; await requireAdmin();
  const supabase=await createClient();
  const{data:quest}=await supabase.from("quests").select("*").eq("id",id).single();
  if(!quest) notFound();
  return <div className="flex flex-col gap-6"><div><h1 className="pixel-font text-xl text-[color:var(--rpg-gold-bright)]">クエストを編集</h1><p className="mt-1 text-sm text-[color:var(--rpg-text-muted)]">配信日時・表示期限はAsia/Tokyoの時刻で入力してください</p></div><QuestForm quest={quest}/></div>;
}
