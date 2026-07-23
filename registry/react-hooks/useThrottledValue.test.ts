import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";

import { useThrottledValue } from "./useThrottledValue";

describe("useThrottledValue", () => {
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

  it("publishes the latest value at the end of the active interval", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottledValue(value, 100),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => {
      now += 50;
      vi.advanceTimersByTime(50);
    });
    rerender({ value: "c" });
    act(() => {
      now += 49;
      vi.advanceTimersByTime(49);
    });
    expect(result.current).toBe("a");
    act(() => {
      now += 1;
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("c");
  });

  it("supports a zero interval", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottledValue(value, 0),
      { initialProps: { value: 1 } },
    );
    rerender({ value: 2 });
    expect(result.current).toBe(2);
  });

  it("preserves function values without invoking them as state updaters", () => {
    const first = vi.fn(() => "first");
    const second = vi.fn(() => "second");
    const { result, rerender } = renderHook(
      ({ value }) => useThrottledValue(value, 100),
      { initialProps: { value: first } },
    );

    expect(result.current).toBe(first);
    expect(first).not.toHaveBeenCalled();

    rerender({ value: second });
    act(() => {
      now += 100;
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(second);
    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
  });

  it("rejects invalid intervals", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() => renderHook(() => useThrottledValue(1, -1))).toThrow(
        RangeError,
      );
    } finally {
      consoleError.mockRestore();
    }
  });
});
