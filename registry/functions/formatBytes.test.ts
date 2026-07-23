import { describe, expect, it } from "bun:test";
import { formatBytes } from "./formatBytes";

describe("formatBytes", () => {
  it("formats decimal and binary units", () => {
    expect(formatBytes(1_500, { locale: "en-US" })).toBe("1.5 kB");
    expect(formatBytes(1_536, { binary: true, locale: "en-US" })).toBe("1.5 KiB");
  });

  it("handles zero, negatives, large values, and rounding", () => {
    expect(formatBytes(0, { locale: "en-US" })).toBe("0 B");
    expect(formatBytes(-2_000, { locale: "en-US" })).toBe("-2 kB");
    expect(formatBytes(0.5, { locale: "en-US" })).toBe("0.5 B");
    expect(formatBytes(1_234_567, { maximumFractionDigits: 2, locale: "en-US" })).toBe("1.23 MB");
  });

  it("validates values and fraction digits", () => {
    expect(() => formatBytes(Infinity)).toThrow(RangeError);
    expect(() => formatBytes(1, { maximumFractionDigits: -1 })).toThrow(RangeError);
  });
});
