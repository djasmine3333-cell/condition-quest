import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { QuestDetailClient } from "@/components/app/quest-detail-client";
export default async function QuestDetailPage({ params }: { params: Promise<{id:string}> }) {
  const { id } = await params;
  const { profile } = await requireUser();
  const supabase = await createClient();
  const { data: quest } = await supabase.from("quests").select("*").eq("id",id).single();
  if(!quest) notFound();
  const { data: completion } = await supabase.from("quest_completions").select("id").eq("quest_id",quest.id).eq("user_id",profile.id).maybeSingle();
  const now=new Date();
  const isWithinWindow=quest.status==="published"&&now>=new Date(quest.scheduled_at)&&now<new Date(quest.expires_at);
  return <QuestDetailClient quest={quest} initiallyCompleted={Boolean(completion)} isWithinWindow={isWithinWindow}/>;
}
