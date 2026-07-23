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

  it("validates input and precision", () => {
    expect(() => roundTo(Infinity, 2)).toThrow(RangeError);
    expect(() => roundTo(1, 1.5)).toThrow(RangeError);
    expect(() => roundTo(1, 101)).toThrow(RangeError);
  });
});
