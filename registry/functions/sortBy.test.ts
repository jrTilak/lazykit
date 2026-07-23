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

  it("does not mutate input", () => {
    const input = [2, 1];
    expect(sortBy(input, (value) => value)).toEqual([1, 2]);
    expect(input).toEqual([2, 1]);
  });
});
