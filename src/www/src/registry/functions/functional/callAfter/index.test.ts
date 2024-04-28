import { describe, expect, it, vi } from "vitest";
import callAfter from ".";

describe("callAfter", () => {
  it("calls the provided function only for the after `count` invocations", () => {
    const fn = vi.fn((x: number) => x + 1);
    const callAfterFn = callAfter(() => fn(1), 2);
    const result1 = callAfterFn();
    const result2 = callAfterFn();
    const result3 = callAfterFn();
    expect(result1).toBe(undefined);
    expect(result2).toBe(undefined);
    expect(result3).toBe(2);
  });

  it("should also accept functions with arguments", () => {
    const fn = vi.fn((x: number) => x + 1);
    const callAfterFn = callAfter(fn, 2);
    const result1 = callAfterFn(1);
    const result2 = callAfterFn(2);
    const result3 = callAfterFn(3);
    expect(result1).toBe(undefined);
    expect(result2).toBe(undefined);
    expect(result3).toBe(4);
  });
});
