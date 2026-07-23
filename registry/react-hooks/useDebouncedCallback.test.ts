import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";

import { useDebouncedCallback } from "./useDebouncedCallback";

describe("useDebouncedCallback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses the latest callback, arguments, and receiver", () => {
    const first = vi.fn(function (this: { factor: number }, value: number) {
      return this.factor * value;
    });
    const second = vi.fn(function (this: { factor: number }, value: number) {
      return this.factor + value;
    });
    const { result, rerender } = renderHook(
      ({ callback }) => useDebouncedCallback(callback, 50),
      { initialProps: { callback: first } },
    );

    const receiver = { factor: 3 };
    act(() => {
      result.current.call(receiver, 2);
    });
    rerender({ callback: second });
    act(() => {
      result.current.call(receiver, 4);
      vi.advanceTimersByTime(50);
    });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    expect(second.mock.contexts[0]).toBe(receiver);
    expect(second).toHaveBeenCalledWith(4);
  });

  it("supports cancel, flush, pending, delay changes, and unmount cleanup", () => {
    const callback = vi.fn();
    const { result, rerender, unmount } = renderHook(
      ({ delay }) => useDebouncedCallback(callback, delay),
      { initialProps: { delay: 100 } },
    );
    const stableCallback = result.current;

    act(() => {
      result.current("old");
    });
    expect(result.current.pending()).toBe(true);
    rerender({ delay: 10 });
    expect(result.current).toBe(stableCallback);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      result.current("flushed");
      result.current.flush();
    });
    expect(callback).toHaveBeenCalledWith("flushed");
    expect(result.current.pending()).toBe(false);

    act(() => {
      result.current("cancelled");
      result.current.cancel();
      result.current("unmounted");
    });
    unmount();
    stableCallback("after unmount");
    expect(stableCallback.pending()).toBe(false);
    act(() => {
      vi.runAllTimers();
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid delays", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() =>
        renderHook(() => useDebouncedCallback(() => {}, Number.NaN)),
      ).toThrow(RangeError);
    } finally {
      consoleError.mockRestore();
    }
  });
});
