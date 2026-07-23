import { describe, expect, it } from "bun:test";
import { countBy } from "./countBy";

describe("countBy", () => {
  it("counts derived keys", () => {
    expect(countBy([1.2, 1.8, 2.1], Math.floor)).toEqual({ 1: 2, 2: 1 });
  });

  it("passes indexes and safely supports special keys", () => {
    const result = countBy(
      ["a", "b"],
      (_, index) => index === 0 ? "constructor" : "__proto__"
    );
    expect(result.constructor).toBe(1);
    expect(result.__proto__).toBe(1);
    expect(Object.getPrototypeOf(result)).toBeNull();
  });

  it("supports symbol keys and keeps independent buckets", () => {
    const first = Symbol("first");
    const second = Symbol("second");
    const result = countBy(
      [first, second, first],
      (value) => value
    );
    expect(result[first]).toBe(2);
    expect(result[second]).toBe(1);
    expect(Reflect.ownKeys(result)).toEqual([first, second]);
  });

  it("skips sparse slots", () => {
    const input = new Array<string>(3);
    input[1] = "present";
    const indexes: number[] = [];
    const result = countBy(input, (_value, index) => {
      indexes.push(index);
      return "values";
    });
    expect(indexes).toEqual([1]);
    expect(result.values).toBe(1);
  });

  it("handles empty input", () => {
    expect(Object.keys(countBy([], String))).toEqual([]);
  });
});
