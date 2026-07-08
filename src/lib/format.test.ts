import { describe, expect, it } from "vitest";
import { money, relativeTime, signedMoney, signedPercent } from "./format";

describe("money", () => {
  it("keeps two decimals under $10,000", () => {
    expect(money(0.27)).toBe("$0.27");
    expect(money(1523.5)).toBe("$1,523.50");
    expect(money(9999.99)).toBe("$9,999.99");
  });

  it("drops cents at $10,000 and above (aggregates)", () => {
    expect(money(10_000)).toBe("$10,000");
    expect(money(152_340.75)).toBe("$152,341");
  });
});

describe("signedMoney / signedPercent", () => {
  it("uses a real minus sign and plus prefix", () => {
    expect(signedMoney(-3)).toBe("−$3.00");
    expect(signedMoney(2.25)).toBe("+$2.25");
    expect(signedPercent(-37.512)).toBe("−37.5%");
    expect(signedPercent(0.25)).toBe("+0.3%");
  });
});

describe("relativeTime ladder", () => {
  const now = new Date("2026-07-08T15:00:00").getTime();
  const min = 60_000;
  it("minutes and hours", () => {
    expect(relativeTime(now - 30_000, now)).toBe("just now");
    expect(relativeTime(now - 12 * min, now)).toBe("12m ago");
    expect(relativeTime(now - 5 * 60 * min, now)).toBe("5h ago");
  });
  it("yesterday", () => {
    expect(relativeTime(new Date("2026-07-07T09:00:00").getTime(), now)).toBe("Yesterday");
  });
  it("month day within the year", () => {
    expect(relativeTime(new Date("2026-05-12T09:00:00").getTime(), now)).toBe("May 12");
  });
  it("month day, year for older", () => {
    expect(relativeTime(new Date("2025-11-03T09:00:00").getTime(), now)).toBe("Nov 3, 2025");
  });
});
