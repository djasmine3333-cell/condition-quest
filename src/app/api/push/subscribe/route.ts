import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
const subscribeSchema=z.object({endpoint:z.string().url(),keys:z.object({p256dh:z.string().min(1),auth:z.string().min(1)})});
export async function POST(request:Request){
  const supabase=await createClient();
  const{data:userData}=await supabase.auth.getUser();
  if(!userData.user)return NextResponse.json({error:"ログインが必要です"},{status:401});
  const body=await request.json().catch(()=>null);
  const parsed=subscribeSchema.safeParse(body);
  if(!parsed.success)return NextResponse.json({error:"リクエストが不正です"},{status:400});
  const{error}=await supabase.from("push_subscriptions").upsert({user_id:userData.user.id,endpoint:parsed.data.endpoint,p256dh:parsed.data.keys.p256dh,auth:parsed.data.keys.auth},{onConflict:"endpoint"});
  if(error)return NextResponse.json({error:"購読の登録に失敗しました"},{status:500});
  return NextResponse.json({ok:true});
}
