import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "./auth";

describe("loginSchema", () => {
  it("企業コード・メール・パスワードが揃っていれば成功する", () => {
    const result = loginSchema.safeParse({
      companyCode: "DEMO-COMPANY",
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("メールアドレスの形式が不正な場合は失敗する", () => {
    const result = loginSchema.safeParse({
      companyCode: "DEMO-COMPANY",
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("企業コードが空の場合は失敗する", () => {
    const result = loginSchema.safeParse({
      companyCode: "",
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });
});

describe("signupSchema", () => {
  it("パスワードが8文字未満の場合は失敗する", () => {
    const result = signupSchema.safeParse({
      companyCode: "DEMO-COMPANY",
      email: "test@example.com",
      password: "short",
      nickname: "テスト太郎",
    });
    expect(result.success).toBe(false);
  });

  it("ニックネームが21文字以上の場合は失敗する", () => {
    const result = signupSchema.safeParse({
      companyCode: "DEMO-COMPANY",
      email: "test@example.com",
      password: "password123",
      nickname: "あ".repeat(21),
    });
    expect(result.success).toBe(false);
  });

  it("すべて正しい場合は成功する", () => {
    const result = signupSchema.safeParse({
      companyCode: "DEMO-COMPANY",
      email: "test@example.com",
      password: "password123",
      nickname: "テスト太郎",
    });
    expect(result.success).toBe(true);
  });
});
