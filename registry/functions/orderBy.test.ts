import { describe, expect, it } from "bun:test";
import { orderBy } from "./orderBy";

describe("orderBy", () => {
  it("applies independent directions", () => {
    const input = [{ team: "a", score: 1 }, { team: "b", score: 2 }, { team: "a", score: 3 }];
    expect(orderBy(input, [{ select: (item) => item.team }, { select: (item) => item.score, order: "desc" }])).toEqual([input[2], input[0], input[1]]);
  });

  it("reverses deterministic special-value groups in descending order", () => {
    const input = [
      { id: "null", value: null },
      { id: "invalid-date", value: new Date("invalid") },
      { id: "two", value: 2 },
      { id: "nan", value: Number.NaN },
      { id: "undefined", value: undefined },
      { id: "one", value: 1 }
    ];
    const ids = (order: "asc" | "desc") =>
      orderBy(input, [{ select: (item) => item.value, order }]).map((item) => item.id);

    expect(ids("asc")).toEqual([
      "one",
      "two",
      "invalid-date",
      "nan",
      "null",
      "undefined"
    ]);
    expect(ids("desc")).toEqual([
      "null",
      "undefined",
      "invalid-date",
      "nan",
      "two",
      "one"
    ]);
  });

  it("evaluates every rule exactly once per item", () => {
    const input = [{ first: 2, second: 3 }, { first: 1, second: 2 }, { first: 1, second: 1 }];
    const firstCalls: typeof input = [];
    const secondCalls: typeof input = [];

    expect(orderBy(input, [
      { select: (item) => { firstCalls.push(item); return item.first; } },
      { select: (item) => { secondCalls.push(item); return item.second; }, order: "desc" }
    ])).toEqual([input[1], input[2], input[0]]);
    expect(firstCalls).toEqual(input);
    expect(secondCalls).toEqual(input);
  });

  it("uses reversible type ranks for mixed values regardless of permutation", () => {
    const permutations = [
      ["2", "10", 3],
      ["2", 3, "10"],
      ["10", "2", 3],
      ["10", 3, "2"],
      [3, "2", "10"],
      [3, "10", "2"]
    ];

    for (const input of permutations) {
      expect(orderBy(input, [{ select: (value) => value }])).toEqual([3, "10", "2"]);
      expect(orderBy(input, [{ select: (value) => value, order: "desc" }])).toEqual(["2", "10", 3]);
    }
  });

  it("returns a copy when no rules are provided", () => {
    const input = [2, 1];
    const result = orderBy(input, []);
    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });

  it("skips empty slots and always returns a dense array", () => {
    const sparse = Array<number>(4);
    sparse[1] = 2;
    sparse[3] = 1;
    const calls: number[] = [];

    expect(orderBy(sparse, [{
      select: (value) => {
        calls.push(value);
        return value;
      }
    }])).toEqual([1, 2]);
    expect(calls).toEqual([2, 1]);
    expect(orderBy(sparse, [])).toEqual([2, 1]);
  });

  it("rejects sparse rule lists", () => {
    const rules = Array<{ select: (value: number) => number }>(1);
    expect(() => orderBy([1], rules)).toThrow(
      "rules must not contain empty slots",
    );
  });

  it("rejects unsupported directions at runtime", () => {
    expect(() => orderBy([1], [
      { select: (value) => value, order: "sideways" as "asc" }
    ])).toThrow('order must be "asc" or "desc"');
  });
});
