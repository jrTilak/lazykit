import { describe, expect, it } from "vitest";
import renameKeysByCallback from ".";

describe("renameKey", () => {
  it("should rename a property in an object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = renameKeysByCallback(obj, (key) => key.toUpperCase());
    expect(result).toEqual({ A: 1, B: 2, C: 3 });
  });
});
