import { NextResponse } from "next/server";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";
export async function POST(request:Request){
  const cronSecret=process.env.CRON_SECRET;
  if(!cronSecret||request.headers.get("authorization")!==`Bearer ${cronSecret}`)return NextResponse.json({error:"認証に失敗しました"},{status:401});
  const vapidPublicKey=process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivateKey=process.env.VAPID_PRIVATE_KEY;
  const vapidSubject=process.env.VAPID_SUBJECT;
  if(!vapidPublicKey||!vapidPrivateKey||!vapidSubject)return NextResponse.json({error:"VAPIDキーが設定されていません"},{status:500});
  webpush.setVapidDetails(vapidSubject,vapidPublicKey,vapidPrivateKey);
  const supabase=createAdminClient();
  const nowIso=new Date().toISOString();
  const{data:activeQuests,error:questsError}=await supabase.from("quests").select("id,notification_title,notification_body").eq("status","published").lte("scheduled_at",nowIso).gt("expires_at",nowIso);
  if(questsError)return NextResponse.json({error:"クエストの取得に失敗しました"},{status:500});
  if(!activeQuests||activeQuests.length===0)return NextResponse.json({sent:0,failed:0,skipped:0});
  const{data:subscriptions,error:subsError}=await supabase.from("push_subscriptions").select("id,endpoint,p256dh,auth,user_id,profiles!inner(notification_enabled)").eq("profiles.notification_enabled",true);
  if(subsError)return NextResponse.json({error:"購読情報の取得に失敗しました"},{status:500});
  if(!subscriptions||subscriptions.length===0)return NextResponse.json({sent:0,failed:0,skipped:0});
  const questIds=activeQuests.map(q=>q.id);
  const{data:existingDeliveries}=await supabase.from("notification_deliveries").select("quest_id,subscription_id").in("quest_id",questIds);
  const alreadySent=new Set((existingDeliveries??[]).map(d=>`${d.quest_id}:${d.subscription_id}`));
  let sent=0,failed=0,skipped=0;
  for(const quest of activeQuests){
    for(const sub of subscriptions){
      const key=`${quest.id}:${sub.id}`;
      if(alreadySent.has(key)){skipped++;continue;}
      try{
        await webpush.sendNotification({endpoint:sub.endpoint,keys:{p256dh:sub.p256dh,auth:sub.auth}},JSON.stringify({title:quest.notification_title,body:quest.notification_body,url:`/quests/${quest.id}`}));
        await supabase.from("notification_deliveries").insert({quest_id:quest.id,subscription_id:sub.id,status:"sent",delivered_at:new Date().toISOString()});
        sent++;
      }catch(err){
        const statusCode=(err as{statusCode?:number}).statusCode;
        await supabase.from("notification_deliveries").insert({quest_id:quest.id,subscription_id:sub.id,status:"failed",error_message:err instanceof Error?err.message:"unknown error"});
        if(statusCode===410||statusCode===404)await supabase.from("push_subscriptions").delete().eq("id",sub.id);
        failed++;
      }
    }
  }
  return NextResponse.json({sent,failed,skipped});
}
