import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";
import { StrictMode } from "react";

import { useIdle } from "./useIdle";

describe("useIdle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("becomes idle and returns active on configured activity", () => {
    const onIdle = vi.fn();
    const onActive = vi.fn();
    const { result } = renderHook(() =>
      useIdle(100, { events: ["keydown"], onIdle, onActive }),
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.isIdle).toBe(true);
    expect(onIdle).toHaveBeenCalledTimes(1);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    });
    expect(result.current.isIdle).toBe(false);
    expect(onActive).toHaveBeenCalledTimes(1);
  });

  it("uses latest callbacks, reset, enabled state, and unmount cleanup", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender, unmount } = renderHook(
      ({ enabled, onIdle }) =>
        useIdle(10, { enabled, events: ["pointerdown"], onIdle }),
      { initialProps: { enabled: true, onIdle: first } },
    );
    rerender({ enabled: true, onIdle: second });
    act(() => {
      result.current.reset();
      vi.advanceTimersByTime(10);
    });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);

    rerender({ enabled: false, onIdle: second });
    expect(result.current.isIdle).toBe(false);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(second).toHaveBeenCalledTimes(1);

    rerender({ enabled: true, onIdle: second });
    unmount();
    act(() => {
      vi.runAllTimers();
      window.dispatchEvent(new PointerEvent("pointerdown"));
    });
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("supports zero and rejects invalid timeouts", () => {
    const { result } = renderHook(() => useIdle(0));
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(result.current.isIdle).toBe(true);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() => renderHook(() => useIdle(Infinity))).toThrow(RangeError);
    } finally {
      consoleError.mockRestore();
    }
  });

  it("invokes lifecycle callbacks without a receiver", () => {
    const receivers: unknown[] = [];
    renderHook(
      () =>
        useIdle(10, {
          events: ["keydown"],
          onIdle: function (this: void) {
            receivers.push(this);
          },
          onActive: function (this: void) {
            receivers.push(this);
          },
        }),
      { wrapper: StrictMode },
    );

    act(() => {
      vi.advanceTimersByTime(10);
      window.dispatchEvent(new KeyboardEvent("keydown"));
    });
    expect(receivers).toEqual([undefined, undefined]);
  });
});
