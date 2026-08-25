"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Mail, Lock, Building2, User, Sparkles } from "lucide-react";
import { RpgButton } from "@/components/rpg/rpg-button";
import { RpgPanel } from "@/components/rpg/rpg-panel";
import { FormError } from "@/components/app/form-error";
import { signupAction } from "@/lib/actions/auth";
export function SignupForm() {
  const router=useRouter();
  const [companyCode,setCompanyCode]=useState(""); const [nickname,setNickname]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState<string|undefined>(); const [needsConfirmation,setNeedsConfirmation]=useState(false); const [isSubmitting,setIsSubmitting]=useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(undefined); setIsSubmitting(true);
    try { const result=await signupAction({companyCode,nickname,email,password}); if(result?.error){setError(result.error)}else if(result?.needsEmailConfirmation){setNeedsConfirmation(true)}else{router.refresh()} } finally { setIsSubmitting(false); }
  }
  if(needsConfirmation) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[color:var(--rpg-navy-deep)] px-6 py-12">
      <RpgPanel className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4 px-5 py-8 text-center">
          <CheckCircle2 className="h-14 w-14 text-[color:var(--rpg-gold-bright)]"/>
          <h2 className="pixel-font text-base text-[color:var(--rpg-gold-bright)]">確認メールを送信しました</h2>
          <p className="text-sm text-[color:var(--rpg-text-muted)]">メール内のリンクから登録を完了させてください。</p>
          <Link href="/login" className="w-full"><RpgButton type="button" className="mt-2">ログイン画面へ</RpgButton></Link>
        </div>
      </RpgPanel>
    </div>
  );
  return (
    <div className="flex min-h-screen flex-col items-center bg-[color:var(--rpg-navy-deep)] px-5 py-10">
      <div className="mb-6 flex flex-col items-center text-center">
        <Sparkles className="mb-2 h-8 w-8 text-[color:var(--rpg-gold-bright)]"/>
        <h1 className="pixel-font text-2xl text-[color:var(--rpg-gold-bright)]">新規登録</h1>
        <p className="mt-2 text-sm text-[color:var(--rpg-text-muted)]">会社から共有された企業コードをご用意ください</p>
      </div>
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormError message={error}/>
          <label className="rpg-input flex h-12 items-center gap-2 px-4 text-sm"><Building2 className="h-4 w-4 shrink-0 opacity-70"/><input value={companyCode} onChange={e=>setCompanyCode(e.target.value)} placeholder="企業コード" autoComplete="off" required className="w-full bg-transparent outline-none placeholder:text-[#8a7a52]"/></label>
          <label className="rpg-input flex h-12 items-center gap-2 px-4 text-sm"><User className="h-4 w-4 shrink-0 opacity-70"/><input value={nickname} onChange={e=>setNickname(e.target.value)} placeholder="ニックネーム(ランキング表示名)" maxLength={20} required className="w-full bg-transparent outline-none placeholder:text-[#8a7a52]"/></label>
          <label className="rpg-input flex h-12 items-center gap-2 px-4 text-sm"><Mail className="h-4 w-4 shrink-0 opacity-70"/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="メールアドレス" autoComplete="email" required className="w-full bg-transparent outline-none placeholder:text-[#8a7a52]"/></label>
          <label className="rpg-input flex h-12 items-center gap-2 px-4 text-sm"><Lock className="h-4 w-4 shrink-0 opacity-70"/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="パスワード(8文字以上)" autoComplete="new-password" minLength={8} required className="w-full bg-transparent outline-none placeholder:text-[#8a7a52]"/></label>
          <RpgButton type="submit" variant="secondary" disabled={isSubmitting} className="mt-2">{isSubmitting?"登録中...":"登録する"}</RpgButton>
        </form>
        <p className="mt-6 text-center text-sm text-[color:var(--rpg-text-muted)]">すでにアカウントをお持ちですか？ <Link href="/login" className="font-bold text-[color:var(--rpg-gold-bright)]">ログインはこちら</Link></p>
      </div>
    </div>
  );
}
