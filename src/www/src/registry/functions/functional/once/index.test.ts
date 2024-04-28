import { describe, expect, it, vi } from "vitest";
import once from ".";

describe("once", () => {
  it("calls the provided function only once", () => {
    const fn = vi.fn((x: number) => x + 1);
    const onceFn = once(() => fn(1));
    const result1 = onceFn();
    const result2 = onceFn();
    const result3 = onceFn();
    expect(result1).toBe(2);
    expect(result2).toBe(undefined);
    expect(result3).toBe(undefined);
  });

  it("should also accept functions with arguments", () => {
    const fn = vi.fn((x: number) => x + 1);
    const onceFn = once(fn);
    const result1 = onceFn(1);
    const result2 = onceFn(2);
    const result3 = onceFn(3);
    expect(result1).toBe(2);
    expect(result2).toBe(undefined);
    expect(result3).toBe(undefined);
  });
});
