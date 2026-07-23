import { describe, expect, it } from "bun:test";
import { orderBy } from "./orderBy";

describe("orderBy", () => {
  it("applies independent directions", () => {
    const input = [{ team: "a", score: 1 }, { team: "b", score: 2 }, { team: "a", score: 3 }];
    expect(orderBy(input, [{ select: (item) => item.team }, { select: (item) => item.score, order: "desc" }])).toEqual([input[2], input[0], input[1]]);
  });

  it("keeps nullish values last in ascending order and first in descending order", () => {
    expect(orderBy([2, undefined, 1], [{ select: (value) => value }])).toEqual([1, 2, undefined]);
    expect(orderBy([2, undefined, 1], [{ select: (value) => value, order: "desc" }])).toEqual([undefined, 2, 1]);
  });

  it("returns a copy when no rules are provided", () => {
    const input = [2, 1];
    const result = orderBy(input, []);
    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });
});
