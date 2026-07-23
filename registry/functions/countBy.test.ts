import { describe, expect, it } from "bun:test";
import { countBy } from "./countBy";

describe("countBy", () => {
  it("counts derived keys", () => {
    expect(countBy([1.2, 1.8, 2.1], Math.floor)).toEqual({ 1: 2, 2: 1 });
  });

  it("passes indexes and safely supports special keys", () => {
    const result = countBy(["a", "b"], (_, index) => index === 0 ? "constructor" : "__proto__");
    expect(result.constructor).toBe(1);
    expect(result.__proto__).toBe(1);
    expect(Object.getPrototypeOf(result)).toBeNull();
  });

  it("handles empty input", () => {
    expect(Object.keys(countBy([], String))).toEqual([]);
  });
});
