import { describe, expect, it } from "bun:test";
import { range } from "./range";

describe("range", () => {
  it("generates ascending, descending, and fractional ranges", () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    expect(range(5, 1)).toEqual([5, 4, 3, 2]);
    expect(range(0, 1, 0.25)).toEqual([0, 0.25, 0.5, 0.75]);
    expect(range(0, 1, 0.1)).toHaveLength(10);
  });

  it("excludes end and handles equal boundaries", () => {
    expect(range(1, 1)).toEqual([]);
    expect(range(0, 5, 2)).toEqual([0, 2, 4]);
  });

  it("validates boundaries and step", () => {
    expect(() => range(0, Infinity)).toThrow(RangeError);
    expect(() => range(0, 1, 0)).toThrow(RangeError);
    expect(() => range(0, 1, -1)).toThrow(RangeError);
    expect(() => range(1, 0, 1)).toThrow(RangeError);
  });
});
