import { describe, expect, it } from "vitest";
import { getTokyoWeekRange, toTokyoDateString } from "./date";

describe("date境界値テスト", () => {
  it("年末年始をまたぐ週の範囲を正しく計算できる", () => {
    // 2026-01-01 は木曜日 (Asia/Tokyo)
    const date = new Date("2026-01-01T03:00:00Z"); // Tokyo 12:00
    const { weekStart, weekEnd } = getTokyoWeekRange(date);
    expect(weekStart).toBe("2025-12-29");
    expect(weekEnd).toBe("2026-01-04");
  });

  it("うるう年の2月29日を正しく扱える", () => {
    const date = new Date("2028-02-29T03:00:00Z");
    expect(toTokyoDateString(date)).toBe("2028-02-29");
  });
});
