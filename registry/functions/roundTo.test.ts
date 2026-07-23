import { describe, expect, it } from "bun:test";
import { roundTo } from "./roundTo";

describe("roundTo", () => {
  it("rounds decimal places without common multiplication drift", () => {
    expect(roundTo(1.005, 2)).toBe(1.01);
    expect(roundTo(1.2345, 3)).toBe(1.235);
  });

  it("supports negative precision", () => {
    expect(roundTo(1_249, -2)).toBe(1_200);
    expect(roundTo(1_250, -2)).toBe(1_300);
  });

  it("uses Math.round semantics for negative ties", () => {
    expect(roundTo(-1.005, 2)).toBe(-1);
    expect(roundTo(-1.015, 2)).toBe(-1.01);
    expect(roundTo(-1_250, -2)).toBe(-1_200);
  });

  it("preserves signed zero", () => {
    expect(Object.is(roundTo(-0, 8), -0)).toBe(true);
    expect(Object.is(roundTo(-0.004, 2), -0)).toBe(true);
    expect(Object.is(roundTo(-Number.MIN_VALUE, -100), -0)).toBe(true);
  });

  it("stays finite across extreme magnitudes and precisions", () => {
    const cases = [
      [Number.MAX_VALUE, 100],
      [-Number.MAX_VALUE, 100],
      [1e308, -100],
      [Number.MIN_VALUE, 100],
      [-Number.MIN_VALUE, 100],
      [1e-100, 100],
      [5e-101, 100]
    ] as const;

    for (const [value, precision] of cases) {
      const result = roundTo(value, precision);
      expect(Number.isFinite(result)).toBe(true);
    }
    expect(roundTo(Number.MAX_VALUE, 100)).toBe(Number.MAX_VALUE);
    expect(roundTo(1e308, 100)).toBe(1e308);
    expect(roundTo(Number.MIN_VALUE, 100)).toBe(0);
    expect(roundTo(1e-100, 100)).toBe(1e-100);
    expect(roundTo(5e-101, 100)).toBe(1e-100);
  });

  it("validates input and precision", () => {
    for (const value of [Infinity, -Infinity, Number.NaN]) {
      expect(() => roundTo(value, 2)).toThrow("value must be finite");
    }
    for (const precision of [1.5, Number.NaN, Infinity, 101, -101]) {
      expect(() => roundTo(1, precision)).toThrow(
        "precision must be a safe integer between -100 and 100"
      );
    }
  });
});
