import { describe, expect, it } from "bun:test";
import { differenceBy } from "./differenceBy";

describe("differenceBy", () => {
  const users = [{ id: 1, name: "Ada" }, { id: 2, name: "Lin" }, { id: 3, name: "Sam" }];

  it("compares derived keys across multiple arrays", () => {
    expect(differenceBy(users, [[{ id: 2, name: "Other" }], [{ id: 3, name: "Else" }]], (user) => user.id)).toEqual([users[0]]);
  });

  it("preserves duplicates not present in comparisons", () => {
    expect(differenceBy([1, 1, 2], [[2]], String)).toEqual([1, 1]);
  });

  it("handles no comparison arrays", () => {
    expect(differenceBy(users, [], (user) => user.id)).toEqual(users);
  });
});
