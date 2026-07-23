import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";

import { useDebouncedValue } from "./useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("publishes only the latest settled value", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "a", delay: 100 } },
    );

    rerender({ value: "b", delay: 100 });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    rerender({ value: "c", delay: 100 });
    act(() => {
      vi.advanceTimersByTime(99);
    });
    expect(result.current).toBe("a");
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("c");
  });

  it("reschedules on delay changes and supports zero", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 1, delay: 100 } },
    );
    rerender({ value: 2, delay: 100 });
    rerender({ value: 2, delay: 0 });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(result.current).toBe(2);
  });

  it("preserves function values without invoking them as state updaters", () => {
    const first = vi.fn(() => "first");
    const second = vi.fn(() => "second");
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 20),
      { initialProps: { value: first } },
    );

    expect(result.current).toBe(first);
    expect(first).not.toHaveBeenCalled();

    rerender({ value: second });
    act(() => {
      vi.advanceTimersByTime(20);
    });

    expect(result.current).toBe(second);
    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
  });

  it("rejects invalid delays", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() => renderHook(() => useDebouncedValue("x", -1))).toThrow(
        RangeError,
      );
    } finally {
      consoleError.mockRestore();
    }
  });
});
