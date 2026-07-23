import { describe, expect, it } from "bun:test";
import { unique } from "./unique";

describe("unique", () => {
  it("removes primitive duplicates in first-seen order", () => {
    expect(unique([3, 1, 3, 2, 1])).toEqual([3, 1, 2]);
  });

  it("deduplicates object references rather than object contents", () => {
    const shared = { value: 1 };
    const equalButDistinct = { value: 1 };
    expect(unique([shared, shared, equalButDistinct])).toEqual([
      shared,
      equalButDistinct,
    ]);
  });

  it("uses SameValueZero semantics for NaN and signed zero", () => {
    expect(unique([Number.NaN, Number.NaN, 0, -0])).toEqual([Number.NaN, 0]);
  });

  it("returns a new empty array", () => {
    const input: number[] = [];
    const result = unique(input);
    expect(result).toEqual([]);
    expect(result).not.toBe(input);
  });

  it("does not mutate the input", () => {
    const input = [1, 1, 2];
    unique(input);
    expect(input).toEqual([1, 1, 2]);
  });

  it("ignores empty slots rather than materializing undefined", () => {
    const sparse = Array<number>(3);
    sparse[1] = 1;
    sparse[2] = 1;
    expect(unique(sparse)).toEqual([1]);
  });
});
