import { describe, expect, it } from "bun:test";
import { updatePath } from "./updatePath";

describe("updatePath", () => {
  it("updates existing values immutably", () => {
    const input = { cart: { count: 2 }, stable: {} };
    const result = updatePath(input, "cart.count", (value) => Number(value) + 1);
    expect(result.cart.count).toBe(3);
    expect(input.cart.count).toBe(2);
    expect(result.stable).toBe(input.stable);
  });

  it("creates missing containers and passes undefined", () => {
    expect(updatePath({}, "items.0", (value) => value ?? "first")).toEqual({ items: ["first"] });
  });

  it("invokes the updater once and rejects unsafe paths", () => {
    let calls = 0;
    updatePath({}, "value", () => ++calls);
    expect(calls).toBe(1);
    expect(() => updatePath({}, "constructor.value", () => 1)).toThrow(TypeError);
  });
});
