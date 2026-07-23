import { describe, expect, it } from "bun:test";
import { maxBy } from "./maxBy";

describe("maxBy", () => {
  it("returns the first maximum", () => {
    const input = [{ n: 2 }, { n: 3 }, { n: 3 }];
    expect(maxBy(input, (item) => item.n)).toBe(input[1]);
  });

  it("ignores non-finite values", () => {
    expect(maxBy([1, 2], (value) => value === 2 ? NaN : value)).toBe(1);
    expect(maxBy([1], () => -Infinity)).toBeUndefined();
  });

  it("returns undefined for empty input", () => {
    expect(maxBy([], Number)).toBeUndefined();
  });

  it("can retain an undefined array value as the maximum", () => {
    expect(maxBy([undefined, "later"], (_, index) => -index)).toBeUndefined();
  });
});
