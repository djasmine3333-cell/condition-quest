"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Building2, Swords } from "lucide-react";
import { RpgButton } from "@/components/rpg/rpg-button";
import { CastleHeroBanner } from "@/components/rpg/castle-banner";
import { HeroPixelIcon } from "@/components/rpg/hero-pixel-icon";
import { FormError } from "@/components/app/form-error";
import { loginAction } from "@/lib/actions/auth";
export function LoginForm() {
  const router = useRouter();
  const [companyCode,setCompanyCode]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState<string|undefined>(); const [isSubmitting,setIsSubmitting]=useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(undefined); setIsSubmitting(true);
    try { const result=await loginAction({companyCode,email,password}); if(result?.error){setError(result.error)}else{router.refresh()} } finally { setIsSubmitting(false); }
  }
  return (
    <div className="flex min-h-screen flex-col items-center bg-[color:var(--rpg-navy-deep)] px-5 pb-12">
      <div className="relative h-44 w-full max-w-md overflow-hidden rounded-b-2xl border-x-2 border-b-2 border-[color:var(--rpg-gold)]">
        <CastleHeroBanner className="h-full w-full"/>
        <div className="absolute inset-x-0 bottom-3 flex justify-center"><HeroPixelIcon className="h-16 w-16 drop-shadow-[0_2px_0_rgba(0,0,0,0.4)]"/></div>
      </div>
      <div className="mb-6 mt-4 flex flex-col items-center text-center">
        <h1 className="pixel-font text-3xl text-[color:var(--rpg-gold-bright)] drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">コンディション<br/>クエスト</h1>
        <span className="rpg-button-primary rpg-button mt-2 px-3 py-1 text-xs font-bold tracking-widest">CONDITION QUEST</span>
        <p className="mt-3 text-sm text-[color:var(--rpg-text-muted)]">✳ 仕事の合間に、1分で整う。 ✳</p>
      </div>
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormError message={error}/>
          <label className="rpg-input flex h-12 items-center gap-2 px-4 text-sm"><Building2 className="h-4 w-4 shrink-0 opacity-70"/><input value={companyCode} onChange={e=>setCompanyCode(e.target.value)} placeholder="企業コード" autoComplete="off" required className="w-full bg-transparent outline-none placeholder:text-[#8a7a52]"/></label>
          <label className="rpg-input flex h-12 items-center gap-2 px-4 text-sm"><Mail className="h-4 w-4 shrink-0 opacity-70"/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="メールアドレス" autoComplete="email" required className="w-full bg-transparent outline-none placeholder:text-[#8a7a52]"/></label>
          <label className="rpg-input flex h-12 items-center gap-2 px-4 text-sm"><Lock className="h-4 w-4 shrink-0 opacity-70"/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="パスワード" autoComplete="current-password" required className="w-full bg-transparent outline-none placeholder:text-[#8a7a52]"/></label>
          <RpgButton type="submit" variant="secondary" disabled={isSubmitting} className="mt-2"><Swords className="h-5 w-5"/>{isSubmitting?"ログイン中...":"ログイン"}</RpgButton>
          <Link href="/signup"><RpgButton type="button" variant="secondary" className="h-12 text-sm">新規登録はこちら</RpgButton></Link>
        </form>
      </div>
    </div>
  );
}
