import { describe, expect, it } from "vitest";
import renameKey from ".";

describe("renameKey", () => {
  it("should rename a property in an object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = renameKey(obj, "a", "d");
    expect(result).toEqual({ b: 2, c: 3, d: 1 });
  });
});
