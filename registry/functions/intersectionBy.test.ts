import { describe, expect, it } from "bun:test";
import { intersectionBy } from "./intersectionBy";

describe("intersectionBy", () => {
  it("keeps first values whose keys occur in every array", () => {
    const first = [{ id: 2, label: "first" }, { id: 2, label: "duplicate" }, { id: 1, label: "one" }];
    expect(intersectionBy(first, [[{ id: 2, label: "other" }]], (item) => item.id)).toEqual([first[0]]);
  });

  it("deduplicates without comparison arrays", () => {
    expect(intersectionBy([1, 1, 2], [], (value) => value)).toEqual([1, 2]);
  });

  it("returns empty when any comparison is empty", () => {
    expect(intersectionBy([1, 2], [[], [1]], String)).toEqual([]);
  });
});
