import { describe, expect, it } from "vitest";
import omit from ".";

describe("omit", () => {
  it("should omit the specified keys", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const keys = ["a", "c"] as Array<keyof typeof obj>;
    const result = omit(obj, keys);
    expect(result).toEqual({ b: 2 });
  });

  it("should not mutate the original object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const keys = ["a", "c"] as Array<keyof typeof obj>;
    omit(obj, keys);
    expect(obj).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("should omit the specified keys from an object with any value type", () => {
    const obj = { a: "a", b: 2, c: true };
    const result = omit(obj, ["a", "c"]);
    expect(result).toEqual({ b: 2 });
  });

  it("should omit the specified keys from an object with numeric keys", () => {
    const obj = { 1: "a", 2: "b", 3: "c" };
    const result = omit(obj, [1, 3]);
    expect(result).toEqual({ 2: "b" });
  });
});
