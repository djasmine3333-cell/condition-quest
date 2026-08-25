"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { RpgButton } from "@/components/rpg/rpg-button";
import { RpgPanel, RpgTitleBar } from "@/components/rpg/rpg-panel";
import { FormError } from "@/components/app/form-error";
import { adminLoginAction } from "@/lib/actions/auth";
export function AdminLoginForm() {
  const router=useRouter(); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState<string|undefined>(); const [isSubmitting,setIsSubmitting]=useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(undefined); setIsSubmitting(true);
    try { const result=await adminLoginAction({email,password}); if(result?.error){setError(result.error)}else{router.refresh()} } finally { setIsSubmitting(false); }
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[color:var(--rpg-navy-deep)] px-6 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <ShieldCheck className="mb-2 h-10 w-10 text-[color:var(--rpg-gold-bright)]"/>
        <h1 className="pixel-font text-2xl text-[color:var(--rpg-gold-bright)]">コンディションクエスト</h1>
        <p className="mt-1 text-sm text-[color:var(--rpg-text-muted)]">管理画面ログイン</p>
      </div>
      <RpgPanel className="w-full max-w-sm">
        <RpgTitleBar>管理者ログイン</RpgTitleBar>
        <div className="px-5 py-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <FormError message={error}/>
            <label className="rpg-input flex h-12 items-center gap-2 px-4 text-sm"><Mail className="h-4 w-4 shrink-0 opacity-70"/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="メールアドレス" autoComplete="email" required className="w-full bg-transparent outline-none placeholder:text-[#8a7a52]"/></label>
            <label className="rpg-input flex h-12 items-center gap-2 px-4 text-sm"><Lock className="h-4 w-4 shrink-0 opacity-70"/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="パスワード" autoComplete="current-password" required className="w-full bg-transparent outline-none placeholder:text-[#8a7a52]"/></label>
            <RpgButton type="submit" disabled={isSubmitting} className="mt-2">{isSubmitting?"ログイン中...":"ログイン"}</RpgButton>
          </form>
        </div>
      </RpgPanel>
    </div>
  );
}
