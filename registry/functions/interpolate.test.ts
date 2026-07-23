import { describe, expect, it } from "bun:test";
import { interpolate } from "./interpolate";

describe("interpolate", () => {
  it("replaces repeated and nested placeholders", () => {
    expect(interpolate("Hello {{ user.name }}, you have {{count}} items, {{user.name}}.", { user: { name: "Ada" }, count: 0 })).toBe("Hello Ada, you have 0 items, Ada.");
  });

  it("supports configurable missing-value behavior", () => {
    expect(interpolate("Hi {{name}}", {})).toBe("Hi {{name}}");
    expect(interpolate("Hi {{name}}", {}, { missing: "empty" })).toBe("Hi ");
    expect(() => interpolate("Hi {{name}}", {}, { missing: "throw" })).toThrow(ReferenceError);
  });

  it("does not read inherited values and stringifies supported values", () => {
    expect(interpolate("{{inherited}}", Object.create({ inherited: "no" }), { missing: "empty" })).toBe("");
    expect(interpolate("{{enabled}}", { enabled: false })).toBe("false");
  });
});
