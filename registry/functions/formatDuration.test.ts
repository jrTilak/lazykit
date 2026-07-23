import { describe, expect, it } from "bun:test";
import { formatDuration } from "./formatDuration";

describe("formatDuration", () => {
  it("formats the largest non-zero units", () => {
    expect(formatDuration(90_500)).toBe("1 m 30 s");
    expect(formatDuration(90_500, { maxUnits: 3 })).toBe("1 m 30 s 500 ms");
    expect(formatDuration(3_600_000 + 60_000)).toBe("1 h 1 m");
  });

  it("handles zero, sub-second, negative, and rounded durations", () => {
    expect(formatDuration(0)).toBe("0 ms");
    expect(formatDuration(250)).toBe("250 ms");
    expect(formatDuration(-1_500)).toBe("-1 s 500 ms");
    expect(formatDuration(0.6)).toBe("1 ms");
  });

  it("validates values and unit count", () => {
    expect(() => formatDuration(NaN)).toThrow(RangeError);
    expect(() => formatDuration(1, { maxUnits: 0 })).toThrow(RangeError);
  });
});
