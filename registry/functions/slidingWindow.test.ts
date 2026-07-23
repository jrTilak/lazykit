import { describe, expect, it } from "bun:test";
import { slidingWindow } from "./slidingWindow";

describe("slidingWindow", () => {
  it("creates overlapping windows", () => {
    expect(slidingWindow([1, 2, 3, 4], 3)).toEqual([[1, 2, 3], [2, 3, 4]]);
  });

  it("supports a custom step and excludes incomplete windows", () => {
    expect(slidingWindow([1, 2, 3, 4, 5], 2, 2)).toEqual([[1, 2], [3, 4]]);
    expect(slidingWindow([1], 2)).toEqual([]);
  });

  it("validates size and step", () => {
    expect(() => slidingWindow([], 0)).toThrow(RangeError);
    expect(() => slidingWindow([], 1, 0)).toThrow(RangeError);
    expect(() => slidingWindow([], 1.5)).toThrow(RangeError);
  });
});
