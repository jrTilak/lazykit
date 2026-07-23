import { describe, expect, it } from "bun:test";
import { unsetPath } from "./unsetPath";

describe("unsetPath", () => {
  it("removes nested values without mutating input", () => {
    const input = { user: { name: "Ada", age: 37 }, untouched: {} };
    const result = unsetPath(input, "user.age");
    expect(result).toEqual({ user: { name: "Ada" }, untouched: {} });
    expect(input.user.age).toBe(37);
    expect(result.untouched).toBe(input.untouched);
  });

  it("removes array entries without leaving holes", () => {
    expect(unsetPath({ values: [1, 2, 3] }, "values.1")).toEqual({ values: [1, 3] });
  });

  it("returns the original object when the path is missing", () => {
    const input = { value: 1 };
    expect(unsetPath(input, "missing.value")).toBe(input);
  });

  it("rejects empty and unsafe paths", () => {
    expect(() => unsetPath({}, "")).toThrow(RangeError);
    expect(() => unsetPath({}, "__proto__.x")).toThrow(TypeError);
  });
});
