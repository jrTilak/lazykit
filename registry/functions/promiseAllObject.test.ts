import { describe, expect, it } from "bun:test";
import { promiseAllObject } from "./promiseAllObject";

describe("promiseAllObject", () => {
  it("resolves values while preserving string and symbol keys", async () => {
    const symbol = Symbol("value");
    const result = await promiseAllObject({ first: Promise.resolve(1), second: 2, [symbol]: Promise.resolve(3) });
    expect(result).toEqual({ first: 1, second: 2, [symbol]: 3 });
  });

  it("ignores non-enumerable properties", async () => {
    const input = { visible: Promise.resolve(1) };
    Object.defineProperty(input, "hidden", { value: Promise.resolve(2) });
    expect(await promiseAllObject(input)).toEqual({ visible: 1 });
  });

  it("rejects when any value rejects", async () => {
    await expect(promiseAllObject({ value: Promise.reject(new Error("failed")) })).rejects.toThrow("failed");
  });

  it("preserves special own keys safely", async () => {
    const input = JSON.parse('{"__proto__":1}') as Record<string, number>;
    const result = await promiseAllObject(input);
    expect(Object.prototype.hasOwnProperty.call(result, "__proto__")).toBe(true);
    expect(result.__proto__).toBe(1);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });
});
