import { describe, expect, it } from "vitest";
import pick from ".";

describe("pick", () => {
  it("should create a new object with only the specified keys", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = pick(obj, ["a", "c"]);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it("should return an empty object if no keys are specified", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = pick(obj, []);
    expect(result).toEqual({});
  });
});
