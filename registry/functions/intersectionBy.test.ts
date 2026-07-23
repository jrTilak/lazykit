import { describe, expect, it } from "bun:test";
import { intersectionBy } from "./intersectionBy";

describe("intersectionBy", () => {
  it("keeps first values whose keys occur in every array", () => {
    const first = [
      { id: 2, label: "first" },
      { id: 2, label: "duplicate" },
      { id: 1, label: "one" },
    ];
    expect(
      intersectionBy(first, [[{ id: 2, label: "other" }]], (item) => item.id),
    ).toEqual([first[0]]);
  });

  it("deduplicates without comparison arrays", () => {
    expect(intersectionBy([1, 1, 2], [], (value) => value)).toEqual([1, 2]);
  });

  it("returns empty when any comparison is empty", () => {
    expect(intersectionBy([1, 2], [[], [1]], String)).toEqual([]);
  });

  it("passes each value's index and current array to the selector", () => {
    const source = [{ id: 1 }, { id: 2 }];
    const comparison = [{ id: 2 }];
    const calls: Array<
      [number, number, readonly ({ id: number } | undefined)[]]
    > = [];

    intersectionBy(source, [comparison], (value, index, array) => {
      calls.push([value.id, index, array]);
      return value.id;
    });

    expect(calls).toEqual([
      [2, 0, comparison],
      [1, 0, source],
      [2, 1, source],
    ]);
  });

  it("does not invoke the selector for empty slots", () => {
    const source = Array<number>(3);
    source[1] = 1;
    const comparison = Array<number>(2);
    comparison[1] = 1;
    const calls: Array<[number, number, boolean]> = [];

    expect(intersectionBy(source, [comparison], (value, index, array) => {
      calls.push([value, index, Object.hasOwn(array, 0)]);
      return value;
    })).toEqual([1]);
    expect(calls).toEqual([[1, 1, false], [1, 1, false]]);
  });

  it("skips empty slots in the comparison-array list", () => {
    const comparisons = Array<readonly number[]>(2);
    comparisons[1] = [2];
    expect(intersectionBy([1, 2], comparisons, String)).toEqual([2]);
  });
});
