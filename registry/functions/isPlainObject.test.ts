import { describe, expect, it } from "bun:test";
import { isPlainObject } from "./isPlainObject";

describe("isPlainObject", () => {
  it("accepts literals and null-prototype objects", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  it("rejects arrays, instances, dates, functions, primitives, and null", () => {
    class Value {}
    for (const value of [[], new Value(), new Date(), () => {}, null, 1, "value"]) {
      expect(isPlainObject(value)).toBe(false);
    }
  });
});
