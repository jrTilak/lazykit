import { describe, expect, it } from "bun:test";
import { partition } from "./partition";

describe("partition", () => {
  it("preserves order in matching and non-matching groups", () => {
    expect(partition([1, 2, 3, 4, 5], (value) => value % 2 === 0)).toEqual([
      [2, 4],
      [1, 3, 5],
    ]);
  });

  it("passes the value, index, and original array", () => {
    const input = ["a"] as const;
    const calls: unknown[][] = [];
    partition(input, (...args) => {
      calls.push(args as unknown[]);
      return true;
    });
    expect(calls).toEqual([["a", 0, input]]);
  });

  it("handles empty input", () => {
    expect(partition([], () => true)).toEqual([[], []]);
  });

  it("handles all matches and no matches", () => {
    expect(partition([1, 2], () => true)).toEqual([[1, 2], []]);
    expect(partition([1, 2], () => false)).toEqual([[], [1, 2]]);
  });

  it("does not mutate the input", () => {
    const input = [3, 1, 2];
    partition(input, (value) => value > 1);
    expect(input).toEqual([3, 1, 2]);
  });

  it("supports predicates that narrow a union", () => {
    const input: Array<number | string> = [1, "two", 3, "four"];
    const [strings, numbers] = partition(
      input,
      (value): value is string => typeof value === "string"
    );
    expect(strings).toEqual(["two", "four"]);
    expect(numbers).toEqual([1, 3]);
  });

  it("skips sparse slots without adding undefined values", () => {
    const input = new Array<number>(3);
    input[1] = 2;
    const leadingSlots: boolean[] = [];
    expect(partition(input, (value, _index, array) => {
      leadingSlots.push(Object.hasOwn(array, 0));
      return value > 0;
    })).toEqual([[2], []]);
    expect(leadingSlots).toEqual([false]);
  });
});
