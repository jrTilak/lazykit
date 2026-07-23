import { describe, expect, it } from "bun:test";
import { sortBy } from "./sortBy";

describe("sortBy", () => {
  it("sorts by multiple selectors and remains stable", () => {
    const input = [{ team: "b", score: 2, id: 1 }, { team: "a", score: 2, id: 2 }, { team: "a", score: 2, id: 3 }, { team: "a", score: 1, id: 4 }];
    expect(sortBy(input, (item) => item.team, (item) => item.score).map((item) => item.id)).toEqual([4, 2, 3, 1]);
  });

  it("places nullish values last and sorts dates", () => {
    expect(sortBy([undefined, 2, null, 1], (value) => value)).toEqual([1, 2, undefined, null]);
    const late = new Date("2024-02-01");
    const early = new Date("2024-01-01");
    expect(sortBy([late, early], (value) => value)).toEqual([early, late]);
  });

  it("orders NaN and invalid dates before nullish values deterministically", () => {
    const input = [
      { id: "null", value: null },
      { id: "invalid-date", value: new Date("invalid") },
      { id: "two", value: 2 },
      { id: "nan", value: Number.NaN },
      { id: "undefined", value: undefined },
      { id: "one", value: 1 }
    ];

    expect(sortBy(input, (item) => item.value).map((item) => item.id)).toEqual([
      "one",
      "two",
      "invalid-date",
      "nan",
      "null",
      "undefined"
    ]);
  });

  it("uses type ranks so mixed values sort identically from every permutation", () => {
    const permutations = [
      ["2", "10", 3],
      ["2", 3, "10"],
      ["10", "2", 3],
      ["10", 3, "2"],
      [3, "2", "10"],
      [3, "10", "2"]
    ];

    for (const input of permutations) {
      expect(sortBy(input, (value) => value)).toEqual([3, "10", "2"]);
    }
  });

  it("evaluates every selector exactly once per item", () => {
    const input = [{ first: 2, second: 3 }, { first: 1, second: 2 }, { first: 1, second: 1 }];
    const firstCalls: typeof input = [];
    const secondCalls: typeof input = [];

    expect(sortBy(
      input,
      (item) => { firstCalls.push(item); return item.first; },
      (item) => { secondCalls.push(item); return item.second; }
    )).toEqual([input[2], input[1], input[0]]);
    expect(firstCalls).toEqual(input);
    expect(secondCalls).toEqual(input);
  });

  it("does not mutate input and returns a copy without selectors", () => {
    const input = [2, 1];
    expect(sortBy(input, (value) => value)).toEqual([1, 2]);
    expect(input).toEqual([2, 1]);

    const copy = sortBy(input);
    expect(copy).toEqual(input);
    expect(copy).not.toBe(input);
  });

  it("skips empty slots and always returns a dense array", () => {
    const sparse = Array<number>(4);
    sparse[1] = 2;
    sparse[3] = 1;
    const calls: number[] = [];

    expect(sortBy(sparse, (value) => {
      calls.push(value);
      return value;
    })).toEqual([1, 2]);
    expect(calls).toEqual([2, 1]);
    expect(sortBy(sparse)).toEqual([2, 1]);
  });

  it("rejects a selector list that materializes an empty slot", () => {
    const selectors = Array<(value: number) => number>(1);
    expect(() => sortBy([1], ...selectors)).toThrow(
      "selectors must contain only functions",
    );
  });

  it("retains order for equal dates and signed zero", () => {
    const firstDate = new Date("2024-01-01");
    const secondDate = new Date("2024-01-01");
    const input = [firstDate, secondDate];
    expect(sortBy(input, (value) => value)).toEqual(input);

    const zeros = [-0, 0];
    const result = sortBy(zeros, (value) => value);
    expect(Object.is(result[0], -0)).toBe(true);
    expect(Object.is(result[1], 0)).toBe(true);
  });
});
