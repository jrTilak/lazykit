import { describe, expect, it } from "bun:test";
import { invert } from "./invert";

describe("invert", () => {
  it("exchanges keys and values and lets later collisions win", () => {
    expect(invert({ first: "a", second: "b", third: "a" })).toEqual({ a: "third", b: "second" });
  });

  it("supports symbols and special keys safely", () => {
    const symbol = Symbol("value");
    const result = invert({ a: symbol, b: "__proto__" });
    expect(result[symbol]).toBe("a");
    expect(result.__proto__).toBe("b");
    expect(Object.getPrototypeOf(result)).toBeNull();
  });

  it("returns numeric source keys in their runtime string form", () => {
    const result = invert({ 1: "one", 2: "two" } as const);
    expect(result).toEqual({ one: "1", two: "2" });
  });

  it("ignores inherited and non-enumerable properties", () => {
    const input = Object.assign(Object.create({ inherited: "parent" }), {
      visible: "kept",
    }) as {
      visible: "kept";
      hidden: "ignored";
      inherited: "parent";
    };
    Object.defineProperty(input, "hidden", {
      value: "ignored",
      enumerable: false,
    });
    expect(invert(input)).toEqual({ kept: "visible" });
  });

  it("rejects an enumerable value that is not a property key", () => {
    expect(() =>
      invert({ invalid: {} } as unknown as { invalid: string })
    ).toThrow("invert expects every enumerable value to be a property key");
  });

  it("snapshots later data properties before an earlier getter deletes them", () => {
    const input = {} as { first: "one"; second: "two" };
    Object.defineProperties(input, {
      first: {
        enumerable: true,
        get: () => {
          Reflect.deleteProperty(input, "second");
          return "one";
        },
      },
      second: { value: "two", enumerable: true, configurable: true },
    });

    expect(invert(input)).toEqual({ one: "first", two: "second" });
  });
});
