"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema, adminLoginSchema, type LoginInput, type SignupInput, type AdminLoginInput } from "@/lib/validations/auth";
export interface AuthActionResult { error?: string; needsEmailConfirmation?: boolean; }
async function resolveCompanyId(supabase: Awaited<ReturnType<typeof createClient>>, companyCode: string): Promise<string|null> {
  const { data, error } = await supabase.rpc("get_company_id_by_code", { p_company_code: companyCode });
  if (error || !data) return null;
  return data;
}
export async function loginAction(input: LoginInput): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください" };
  const { companyCode, email, password } = parsed.data;
  const supabase = await createClient();
  const companyId = await resolveCompanyId(supabase, companyCode);
  if (!companyId) return { error: "企業コードが見つかりません" };
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError || !signInData.user) return { error: "メールアドレスまたはパスワードが正しくありません" };
  const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", signInData.user.id).single();
  if (!profile || profile.company_id !== companyId) { await supabase.auth.signOut(); return { error: "企業コードが正しくありません" }; }
  redirect("/home");
}
export async function signupAction(input: SignupInput): Promise<AuthActionResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください" };
  const { companyCode, email, password, nickname } = parsed.data;
  const supabase = await createClient();
  const companyId = await resolveCompanyId(supabase, companyCode);
  if (!companyId) return { error: "企業コードが見つかりません" };
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { company_id: companyId, nickname } } });
  if (error) { if (error.message.toLowerCase().includes("already registered")) return { error: "このメールアドレスは既に登録されています" }; return { error: "登録に失敗しました" }; }
  if (!data.session) return { needsEmailConfirmation: true };
  redirect("/home");
}
export async function adminLoginAction(input: AdminLoginInput): Promise<AuthActionResult> {
  const parsed = adminLoginSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください" };
  const { email, password } = parsed.data;
  const supabase = await createClient();
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError || !signInData.user) return { error: "メールアドレスまたはパスワードが正しくありません" };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", signInData.user.id).single();
  if (!profile || profile.role !== "super_admin") { await supabase.auth.signOut(); return { error: "管理者権限がありません" }; }
  redirect("/admin");
}
export async function signOutAction(redirectTo: "/login"|"/admin/login") {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(redirectTo);
}
