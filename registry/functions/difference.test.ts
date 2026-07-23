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

  it("allows comparison arrays with unrelated value types", () => {
    expect(difference([1, 2], ["2"], [false, 2])).toEqual([1]);
  });

  it("skips holes without treating them as undefined values", () => {
    const source = Array<number | undefined>(3);
    source[1] = undefined;
    source[2] = 1;
    const comparison = Array<number | undefined>(1);

    expect(difference(source, comparison)).toEqual([undefined, 1]);
    comparison[0] = undefined;
    expect(difference(source, comparison)).toEqual([1]);
  });

  it("rejects comparison holes materialized through a rest spread", () => {
    const comparisons = Array<readonly number[]>(1);
    expect(() => difference([1], ...comparisons)).toThrow(
      "comparison values must be arrays",
    );
  });
});
