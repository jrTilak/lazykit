import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";
import { StrictMode, useLayoutEffect } from "react";

import { useTimeout } from "./useTimeout";

describe("useTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses the latest callback without restarting the timer", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(
      ({ callback }) => useTimeout(callback, 100),
      { initialProps: { callback: first } },
    );

    act(() => {
      vi.advanceTimersByTime(50);
    });
    rerender({ callback: second });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    expect(result.current.isPending).toBe(false);
  });

  it("handles reset, cancel, delay changes, null, zero, and unmount", () => {
    const callback = vi.fn();
    const { result, rerender, unmount } = renderHook(
      ({ delay }) => useTimeout(callback, delay),
      { initialProps: { delay: 100 as number | null } },
    );

    act(() => {
      vi.advanceTimersByTime(50);
      result.current.reset();
      vi.advanceTimersByTime(50);
    });
    expect(callback).not.toHaveBeenCalled();
    act(() => {
      result.current.cancel();
      vi.runAllTimers();
    });
    expect(callback).not.toHaveBeenCalled();

    rerender({ delay: null });
    expect(result.current.isPending).toBe(false);
    rerender({ delay: 0 });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(callback).toHaveBeenCalledTimes(1);

    const resetAfterUnmount = result.current.reset;
    unmount();
    resetAfterUnmount();
    act(() => {
      vi.runAllTimers();
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("can be cancelled from the caller's layout effect", () => {
    const callback = vi.fn();
    const { result } = renderHook(
      () => {
        const timeout = useTimeout(callback, 10);
        useLayoutEffect(() => {
          timeout.cancel();
        }, [timeout.cancel]);
        return timeout;
      },
      { wrapper: StrictMode },
    );

    expect(result.current.isPending).toBe(false);
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it("invokes the callback without a receiver", () => {
    let receiver: unknown = "not called";
    renderHook(() =>
      useTimeout(function (this: void) {
        receiver = this;
      }, 10),
    );

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(receiver).toBeUndefined();
  });

  it("rejects invalid delays", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() => renderHook(() => useTimeout(() => {}, -1))).toThrow(
        RangeError,
      );
    } finally {
      consoleError.mockRestore();
    }
  });
});
