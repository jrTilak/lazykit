import { describe, expect, it } from "bun:test";
import { mapKeys } from "./mapKeys";

describe("mapKeys", () => {
  it("maps string and symbol keys and passes callback context", () => {
    const symbol = Symbol("mapped");
    const input = { first: 1, second: 2 };
    const calls: unknown[][] = [];
    const result = mapKeys(input, (value, key, object) => {
      calls.push([value, key, object]);
      return key === "first" ? symbol : key.toUpperCase();
    });
    expect(result[symbol]).toBe(1);
    expect(result.SECOND).toBe(2);
    expect(calls[0]).toEqual([1, "first", input]);
  });

  it("lets later collisions win safely", () => {
    const result = mapKeys({ a: 1, b: 2 }, () => "__proto__");
    expect(result.__proto__).toBe(2);
    expect(Object.getPrototypeOf(result)).toBeNull();
  });
});
