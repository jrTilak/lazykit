import { describe, expect, it } from "bun:test";
import { minBy } from "./minBy";

describe("minBy", () => {
  it("returns the first minimum", () => {
    const input = [{ n: 2 }, { n: 1 }, { n: 1 }];
    expect(minBy(input, (item) => item.n)).toBe(input[1]);
  });

  it("ignores non-finite values and passes indexes", () => {
    expect(minBy([10, 10], (_, index) => index === 0 ? NaN : index)).toBe(10);
    expect(minBy([1], () => Infinity)).toBeUndefined();
  });

  it("returns undefined for empty input", () => {
    expect(minBy([], Number)).toBeUndefined();
  });

  it("can retain an undefined array value as the minimum", () => {
    expect(minBy([undefined, "later"], (_, index) => index)).toBeUndefined();
  });
});
