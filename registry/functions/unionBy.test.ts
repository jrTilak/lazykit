import { describe, expect, it } from "bun:test";
import { unionBy } from "./unionBy";

describe("unionBy", () => {
  it("combines arrays and keeps the earliest value for each key", () => {
    const first = { id: 1, source: "first" };
    expect(unionBy([[first], [{ id: 1, source: "second" }, { id: 2, source: "second" }]], (item) => item.id)).toEqual([first, { id: 2, source: "second" }]);
  });

  it("supports empty input and object keys", () => {
    const key = {};
    expect(unionBy([], String)).toEqual([]);
    expect(unionBy([[{ key }, { key }]], (item) => item.key)).toHaveLength(1);
  });
});
