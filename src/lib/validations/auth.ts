import { z } from "zod";
export const loginSchema = z.object({ companyCode: z.string().trim().min(1,"企業コードを入力してください").max(50), email: z.string().trim().email("メールアドレスの形式が正しくありません"), password: z.string().min(1,"パスワードを入力してください") });
export type LoginInput = z.infer<typeof loginSchema>;
export const signupSchema = z.object({ companyCode: z.string().trim().min(1,"企業コードを入力してください").max(50), email: z.string().trim().email("メールアドレスの形式が正しくありません"), password: z.string().min(8,"パスワードは8文字以上で入力してください").max(72), nickname: z.string().trim().min(1,"ニックネームを入力してください").max(20,"ニックネームは20文字以内で入力してください") });
export type SignupInput = z.infer<typeof signupSchema>;
export const adminLoginSchema = z.object({ email: z.string().trim().email("メールアドレスの形式が正しくありません"), password: z.string().min(1,"パスワードを入力してください") });
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
