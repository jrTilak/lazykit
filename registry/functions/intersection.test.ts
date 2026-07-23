import { describe, expect, it } from "bun:test";
import { intersection } from "./intersection";

describe("intersection", () => {
  it("returns distinct values shared by every array in first-seen order", () => {
    expect(intersection([3, 2, 2, 1], [2, 3], [3, 2, 4])).toEqual([3, 2]);
  });

  it("returns distinct input values without comparisons", () => {
    expect(intersection([1, 1, 2])).toEqual([1, 2]);
  });

  it("handles empty arrays and SameValueZero equality", () => {
    expect(intersection([NaN], [NaN])).toEqual([NaN]);
    expect(intersection([1], [])).toEqual([]);
  });

  it("compares against arrays with unrelated value types", () => {
    expect(intersection([1, 2, 3], ["2", 2], [false, 2])).toEqual([2]);
  });

  it("ignores empty slots in the ordered source array", () => {
    const sparse = Array<number>(2);
    sparse[1] = 1;
    expect(intersection(sparse)).toEqual([1]);
  });

  it("does not treat comparison holes as undefined values", () => {
    const sparse = Array<undefined>(1);
    expect(intersection([undefined], sparse)).toEqual([]);
    sparse[0] = undefined;
    expect(intersection([undefined], sparse)).toEqual([undefined]);
  });

  it("rejects comparison holes materialized through a rest spread", () => {
    const comparisons = Array<readonly number[]>(1);
    expect(() => intersection([1], ...comparisons)).toThrow(
      "comparison values must be arrays",
    );
  });
});
