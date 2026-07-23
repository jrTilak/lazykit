import { describe, expect, it } from "bun:test";
import { getPath } from "./getPath";

describe("getPath", () => {
  const symbol = Symbol("value");
  const input = { user: { profile: { name: "Ada" }, values: [10] }, undefinedValue: undefined, [symbol]: 42 };

  it("reads dot paths and array indexes", () => {
    expect(getPath(input, "user.profile.name")).toBe("Ada");
    expect(getPath(input, "user.values.0")).toBe(10);
  });

  it("supports segment arrays and symbols", () => {
    expect(getPath(input, [symbol])).toBe(42);
    expect(getPath(input, ["user", "profile"])).toEqual({ name: "Ada" });
  });

  it("uses defaults for missing and undefined values", () => {
    expect(getPath(input, "missing.path", "fallback")).toBe("fallback");
    expect(getPath(input, "undefinedValue", "fallback")).toBe("fallback");
  });

  it("returns the root for an empty path and ignores inherited values", () => {
    expect(getPath(input, "")).toBe(input);
    expect(getPath(Object.create({ inherited: true }), "inherited")).toBeUndefined();
  });
});
