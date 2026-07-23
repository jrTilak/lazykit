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
});
