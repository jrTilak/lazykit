import { describe, expect, it } from "bun:test";
import { differenceBy } from "./differenceBy";

describe("differenceBy", () => {
  const users = [
    { id: 1, name: "Ada" },
    { id: 2, name: "Lin" },
    { id: 3, name: "Sam" },
  ];

  it("compares derived keys across multiple arrays", () => {
    expect(
      differenceBy(
        users,
        [[{ id: 2, name: "Other" }], [{ id: 3, name: "Else" }]],
        (user) => user.id,
      ),
    ).toEqual([users[0]]);
  });

  it("preserves duplicates not present in comparisons", () => {
    expect(differenceBy([1, 1, 2], [[2]], String)).toEqual([1, 1]);
  });

  it("handles no comparison arrays", () => {
    expect(differenceBy(users, [], (user) => user.id)).toEqual(users);
  });

  it("passes each value's index and current array to the selector", () => {
    const source = [{ id: 1 }, { id: 2 }];
    const comparison = [{ id: 2 }];
    const calls: Array<
      [number, number, readonly ({ id: number } | undefined)[]]
    > = [];

    differenceBy(source, [comparison], (value, index, array) => {
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
    comparison[1] = 2;
    const calls: Array<[number, number, boolean]> = [];

    expect(differenceBy(source, [comparison], (value, index, array) => {
      calls.push([value, index, Object.hasOwn(array, 0)]);
      return value;
    })).toEqual([1]);
    expect(calls).toEqual([[2, 1, false], [1, 1, false]]);
  });

  it("skips empty slots in the comparison-array list", () => {
    const comparisons = Array<readonly number[]>(2);
    comparisons[1] = [2];
    expect(differenceBy([1, 2], comparisons, String)).toEqual([1]);
  });
});
