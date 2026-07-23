import { describe, expect, it } from "bun:test";
import { sumBy } from "./sumBy";

describe("sumBy", () => {
  it("sums selector results and passes indexes", () => {
    expect(sumBy([10, 20, 30], (value, index) => value + index)).toBe(63);
  });

  it("returns zero for empty input", () => {
    expect(sumBy([], Number)).toBe(0);
  });

  it("rejects non-finite selector results", () => {
    expect(() => sumBy([1], () => NaN)).toThrow(RangeError);
    expect(() => sumBy([1], () => Infinity)).toThrow(RangeError);
  });
});
