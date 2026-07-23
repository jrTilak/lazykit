import { describe, expect, it } from "bun:test";
import { hasPath } from "./hasPath";

describe("hasPath", () => {
  it("distinguishes present undefined values from missing values", () => {
    expect(hasPath({ value: undefined }, "value")).toBe(true);
    expect(hasPath({ value: undefined }, "missing")).toBe(false);
  });

  it("supports dot paths, arrays, and symbols", () => {
    const symbol = Symbol("key");
    const input = { nested: [{ value: 1 }], [symbol]: true };
    expect(hasPath(input, "nested.0.value")).toBe(true);
    expect(hasPath(input, [symbol])).toBe(true);
  });

  it("treats the empty path as the root and ignores inheritance", () => {
    expect(hasPath(null, "")).toBe(true);
    expect(hasPath(Object.create({ value: 1 }), "value")).toBe(false);
  });
});
