import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";
import { useLayoutEffect } from "react";

import { useThrottledCallback } from "./useThrottledCallback";

describe("useThrottledCallback", () => {
  let now = 1_000;

  beforeEach(() => {
    vi.useFakeTimers();
    now = 1_000;
    vi.spyOn(Date, "now").mockImplementation(() => now);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("invokes on the leading edge with the latest callback and receiver", () => {
    const first = vi.fn(function (this: { base: number }, value: number) {
      return this.base + value;
    });
    const second = vi.fn(function (this: { base: number }, value: number) {
      return this.base * value;
    });
    const { result, rerender } = renderHook(
      ({ callback }) => useThrottledCallback(callback, 100),
      { initialProps: { callback: first } },
    );
    const receiver = { base: 4 };

    expect(result.current.call(receiver, 2)).toBe(6);
    expect(result.current.call(receiver, 3)).toBeUndefined();
    rerender({ callback: second });
    act(() => {
      now += 100;
      vi.advanceTimersByTime(100);
    });
    expect(result.current.call(receiver, 3)).toBe(12);
    expect(second.mock.contexts[0]).toBe(receiver);
  });

  it("can reset and resets when the interval changes", () => {
    const callback = vi.fn(() => 1);
    const { result, rerender } = renderHook(
      ({ interval }) => useThrottledCallback(callback, interval),
      { initialProps: { interval: 100 } },
    );
    const stableCallback = result.current;

    expect(result.current()).toBe(1);
    expect(result.current()).toBeUndefined();
    result.current.reset();
    expect(result.current()).toBe(1);
    rerender({ interval: 200 });
    expect(result.current).toBe(stableCallback);
    expect(result.current()).toBe(1);
  });

  it("publishes the latest callback before caller layout effects", () => {
    const first = vi.fn(() => "first");
    const second = vi.fn(() => "second");
    const values: string[] = [];
    const { rerender } = renderHook(
      ({ callback, version }) => {
        const throttled = useThrottledCallback(callback, 0);
        useLayoutEffect(() => {
          const value = throttled();
          if (value !== undefined) values.push(value);
        }, [throttled, version]);
      },
      { initialProps: { callback: first, version: 0 } },
    );

    rerender({ callback: second, version: 1 });
    expect(values).toEqual(["first", "second"]);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid intervals", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() =>
        renderHook(() => useThrottledCallback(() => {}, Infinity)),
      ).toThrow(RangeError);
    } finally {
      consoleError.mockRestore();
    }
  });
});
