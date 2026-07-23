import { describe, expect, it } from "bun:test";
import { uniqueBy } from "./uniqueBy";

describe("uniqueBy", () => {
  it("keeps the first value for each key", () => {
    const input = [{ id: 1, name: "first" }, { id: 1, name: "second" }, { id: 2, name: "third" }];
    expect(uniqueBy(input, (item) => item.id)).toEqual([input[0], input[2]]);
  });

  it("passes the index and supports object identity keys", () => {
    const key = {};
    expect(uniqueBy([key, key], (value, index) => index === 0 ? value : key)).toEqual([key]);
  });

  it("handles empty input", () => {
    expect(uniqueBy([], String)).toEqual([]);
  });
});
