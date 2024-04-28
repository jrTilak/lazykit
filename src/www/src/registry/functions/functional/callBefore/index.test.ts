import { describe, expect, it, vi } from "vitest";
import callBefore from ".";

describe("callBefore", () => {
  it("calls the provided function only for the first `count` invocations", () => {
    const fn = vi.fn((x: number) => x + 1);
    const callBeforeFn = callBefore(() => fn(1), 2);
    const result1 = callBeforeFn();
    const result2 = callBeforeFn();
    const result3 = callBeforeFn();
    expect(result1).toBe(2);
    expect(result2).toBe(2);
    expect(result3).toBe(undefined);
  });

  it("should also accept functions with arguments", () => {
    const fn = vi.fn((x: number) => x + 1);
    const callBeforeFn = callBefore(fn, 2);
    const result1 = callBeforeFn(1);
    const result2 = callBeforeFn(2);
    const result3 = callBeforeFn(3);
    expect(result1).toBe(2);
    expect(result2).toBe(3);
    expect(result3).toBe(undefined);
  });
});
