import { describe, expect, it } from "vitest";
import partition from ".";

describe("partition", () => {
  it("should partition the array based on the given predicate", () => {
    const arr = [1, 2, 3, 4, 5];
    const predicate = (value: number) => value % 2 === 0;

    const result = partition(arr, predicate);

    expect(result).toEqual([
      [2, 4],
      [1, 3, 5],
    ]);
  });

  it("should handle an empty array", () => {
    const arr: number[] = [];
    const predicate = (value: number) => value > 0;

    const result = partition(arr, predicate);

    expect(result).toEqual([[], []]);
  });

  it("should handle an array where all elements satisfy the predicate", () => {
    const arr = [2, 4, 6, 8];
    const predicate = (value: number) => value % 2 === 0;

    const result = partition(arr, predicate);

    expect(result).toEqual([[2, 4, 6, 8], []]);
  });

  it("should handle an array where no elements satisfy the predicate", () => {
    const arr = [1, 3, 5, 7];
    const predicate = (value: number) => value % 2 === 0;

    const result = partition(arr, predicate);

    expect(result).toEqual([[], [1, 3, 5, 7]]);
  });
});
