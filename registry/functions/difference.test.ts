import { describe, expect, it } from "bun:test";
import { difference } from "./difference";

describe("difference", () => {
  it("excludes values found in any comparison array", () => {
    expect(difference([1, 2, 2, 3, 4], [2], [4, 5])).toEqual([1, 3]);
  });

  it("uses SameValueZero equality", () => {
    expect(difference([NaN, 0, -0], [NaN, -0])).toEqual([]);
  });

  it("returns a copy when there are no comparison arrays", () => {
    const input = [1, 2];
    const result = difference(input);
    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });
});
