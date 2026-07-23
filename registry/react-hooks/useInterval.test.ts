import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";

import { useInterval } from "./useInterval";

describe("useInterval", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses the latest callback and reschedules when the delay changes", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(
      ({ callback, delay }) => useInterval(callback, delay),
      {
        initialProps: {
          callback: first,
          delay: 100 as number | null,
        },
      },
    );

    act(() => {
      vi.advanceTimersByTime(50);
    });
    rerender({ callback: second, delay: 50 });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);

    rerender({ callback: second, delay: null });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("supports zero and cleans up on unmount", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useInterval(callback, 0));
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(callback).toHaveBeenCalled();
    const calls = callback.mock.calls.length;
    unmount();
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(callback).toHaveBeenCalledTimes(calls);
  });

  it("invokes the callback without a receiver", () => {
    let receiver: unknown = "not called";
    renderHook(() =>
      useInterval(function (this: void) {
        receiver = this;
      }, 10),
    );

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(receiver).toBeUndefined();
  });

  it("rejects invalid intervals", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() =>
        renderHook(() => useInterval(() => {}, Number.NaN)),
      ).toThrow(RangeError);
    } finally {
      consoleError.mockRestore();
    }
  });
});
