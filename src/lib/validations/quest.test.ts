import { describe, expect, it } from "vitest";
import { questFormSchema } from "./quest";

const validBase = {
  title: "30秒だけ遠くを見よう",
  description: "画面から目を離して遠くを見ましょう。",
  category: "mental" as const,
  durationSeconds: 30,
  points: 5,
  notificationTitle: "今すぐクエスト",
  notificationBody: "30秒だけ遠くを見よう",
  status: "published" as const,
};

describe("questFormSchema", () => {
  it("表示期限が配信日時より後であれば成功する", () => {
    const result = questFormSchema.safeParse({
      ...validBase,
      scheduledAtLocal: "2026-07-01T10:00",
      expiresAtLocal: "2026-07-01T10:10",
    });
    expect(result.success).toBe(true);
  });

  it("表示期限が配信日時より前(または同時刻)の場合は失敗する", () => {
    const result = questFormSchema.safeParse({
      ...validBase,
      scheduledAtLocal: "2026-07-01T10:00",
      expiresAtLocal: "2026-07-01T09:00",
    });
    expect(result.success).toBe(false);
  });

  it("ポイントが範囲外(1000超)の場合は失敗する", () => {
    const result = questFormSchema.safeParse({
      ...validBase,
      points: 1001,
      scheduledAtLocal: "2026-07-01T10:00",
      expiresAtLocal: "2026-07-01T10:10",
    });
    expect(result.success).toBe(false);
  });

  it("不正なカテゴリの場合は失敗する", () => {
    const result = questFormSchema.safeParse({
      ...validBase,
      category: "invalid-category",
      scheduledAtLocal: "2026-07-01T10:00",
      expiresAtLocal: "2026-07-01T10:10",
    });
    expect(result.success).toBe(false);
  });
});
