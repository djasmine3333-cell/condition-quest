import { describe, expect, it } from "vitest";
import {
  toTokyoDateString,
  getTokyoWeekRange,
  tokyoLocalInputToUtcIso,
  utcIsoToTokyoLocalInput,
} from "./date";

describe("toTokyoDateString", () => {
  it("UTCで日付が変わる前でも、Asia/Tokyoでは次の日になっているケースを正しく扱う", () => {
    // UTC 2026-06-27 15:30 = Asia/Tokyo 2026-06-28 00:30
    const date = new Date("2026-06-27T15:30:00Z");
    expect(toTokyoDateString(date)).toBe("2026-06-28");
  });

  it("UTCそのままだと日付が変わらない時間帯はそのまま", () => {
    // UTC 2026-06-27 01:00 = Asia/Tokyo 2026-06-27 10:00
    const date = new Date("2026-06-27T01:00:00Z");
    expect(toTokyoDateString(date)).toBe("2026-06-27");
  });
});

describe("getTokyoWeekRange", () => {
  it("週の中央の水曜日から月曜始まり・日曜終わりの週を計算できる", () => {
    // 2026-07-01 は水曜日 (Asia/Tokyo)
    const date = new Date("2026-07-01T03:00:00Z"); // Tokyo 12:00
    const { weekStart, weekEnd } = getTokyoWeekRange(date);
    expect(weekStart).toBe("2026-06-29"); // 月曜
    expect(weekEnd).toBe("2026-07-05"); // 日曜
  });

  it("日曜日を指定した場合、その週の月曜〜日曜が正しく計算される", () => {
    // 2026-07-05 は日曜日 (Asia/Tokyo)
    const date = new Date("2026-07-05T03:00:00Z");
    const { weekStart, weekEnd } = getTokyoWeekRange(date);
    expect(weekStart).toBe("2026-06-29");
    expect(weekEnd).toBe("2026-07-05");
  });

  it("月曜日0時(Asia/Tokyo)を指定した場合もその週として計算される", () => {
    // Asia/Tokyo 2026-06-29 00:00 = UTC 2026-06-28 15:00
    const date = new Date("2026-06-28T15:00:00Z");
    const { weekStart, weekEnd } = getTokyoWeekRange(date);
    expect(weekStart).toBe("2026-06-29");
    expect(weekEnd).toBe("2026-07-05");
  });
});

describe("tokyoLocalInputToUtcIso / utcIsoToTokyoLocalInput", () => {
  it("Asia/TokyoのローカルdatetimeをUTCのISO文字列に正しく変換できる", () => {
    // Asia/Tokyo 2026-06-28 13:30 -> UTC 2026-06-28 04:30
    const iso = tokyoLocalInputToUtcIso("2026-06-28T13:30");
    expect(iso).toBe("2026-06-28T04:30:00.000Z");
  });

  it("UTCのISO文字列をAsia/Tokyoのローカルdatetime表記に逆変換できる(往復一致)", () => {
    const original = "2026-06-28T13:30";
    const iso = tokyoLocalInputToUtcIso(original);
    const roundTripped = utcIsoToTokyoLocalInput(iso);
    expect(roundTripped).toBe(original);
  });

  it("日付が変わる境界（深夜0時台）でも正しく変換できる", () => {
    // Asia/Tokyo 2026-06-28 00:15 -> UTC 2026-06-27 15:15
    const iso = tokyoLocalInputToUtcIso("2026-06-28T00:15");
    expect(iso).toBe("2026-06-27T15:15:00.000Z");
  });
});
