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
});
