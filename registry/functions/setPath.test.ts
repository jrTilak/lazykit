import { describe, expect, it } from "bun:test";
import { setPath } from "./setPath";

describe("setPath", () => {
  it("updates nested values without mutating shared input", () => {
    const input = { user: { name: "Ada", settings: { dark: false } }, untouched: {} };
    const result = setPath(input, "user.settings.dark", true);
    expect(result.user.settings.dark).toBe(true);
    expect(input.user.settings.dark).toBe(false);
    expect(result.user).not.toBe(input.user);
    expect(result.untouched).toBe(input.untouched);
  });

  it("creates objects and arrays for missing segments", () => {
    expect(setPath({}, "users.0.name", "Ada")).toEqual({ users: [{ name: "Ada" }] });
  });

  it("supports segment arrays and symbols", () => {
    const symbol = Symbol("value");
    expect(setPath({}, [symbol], 1)[symbol]).toBe(1);
  });

  it("rejects empty and unsafe paths", () => {
    expect(() => setPath({}, "", 1)).toThrow(RangeError);
    expect(() => setPath({}, "__proto__.polluted", true)).toThrow(TypeError);
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
  });
});
