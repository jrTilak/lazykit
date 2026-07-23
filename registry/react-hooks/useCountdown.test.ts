import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";
import { useLayoutEffect } from "react";

import { useCountdown } from "./useCountdown";

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("clamps overshoot and completes exactly once", () => {
    const onChange = vi.fn();
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useCountdown({
        from: 5,
        to: 0,
        step: 3,
        intervalMs: 10,
        autoStart: true,
        onChange,
        onComplete,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(20);
    });
    expect(result.current.value).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(onChange.mock.calls.map(([value]) => value)).toEqual([2, 0]);
    expect(onComplete).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("counts upward and supports pause, reset, and restart", () => {
    const { result } = renderHook(() =>
      useCountdown({ from: 0, to: 3, intervalMs: 10 }),
    );

    act(() => {
      result.current.start();
    });
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.value).toBe(1);
    act(() => {
      result.current.pause();
    });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.value).toBe(1);
    act(() => {
      result.current.reset();
    });
    expect(result.current.value).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  it("shows the terminal value for one interval before looping", () => {
    const { result } = renderHook(() =>
      useCountdown({
        from: 2,
        to: 0,
        intervalMs: 10,
        autoStart: true,
        loop: true,
      }),
    );
    act(() => {
      vi.advanceTimersByTime(20);
    });
    expect(result.current.value).toBe(0);
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.value).toBe(2);
    expect(result.current.isRunning).toBe(true);
  });

  it("respects a reentrant start from onComplete", () => {
    let start: (() => void) | undefined;
    const onComplete = vi.fn(() => {
      start?.();
    });
    const { result } = renderHook(() =>
      useCountdown({
        from: 1,
        to: 0,
        intervalMs: 10,
        autoStart: true,
        onComplete,
      }),
    );
    start = result.current.start;

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.value).toBe(1);
    expect(result.current.isRunning).toBe(true);
  });

  it("pauses and resumes on autoStart changes without resetting progress", () => {
    type Props = { from: number; to: number; autoStart: boolean };
    const { result, rerender } = renderHook(
      ({ from, to, autoStart }: Props) =>
        useCountdown({ from, to, autoStart, intervalMs: 10 }),
      { initialProps: { from: 3, to: 0, autoStart: true } },
    );

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.value).toBe(2);

    rerender({ from: 3, to: 0, autoStart: false });
    expect(result.current.value).toBe(2);
    expect(result.current.isRunning).toBe(false);
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.value).toBe(2);

    rerender({ from: 3, to: 0, autoStart: true });
    expect(result.current.value).toBe(2);
    expect(result.current.isRunning).toBe(true);
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.value).toBe(1);

    rerender({ from: 5, to: 3, autoStart: true });
    expect(result.current.value).toBe(5);
    expect(result.current.isRunning).toBe(true);
  });

  it("publishes new endpoints before caller layout controls run", () => {
    type Command = "none" | "reset" | "start";
    type Props = { from: number; to: number; command: Command };
    const { result, rerender } = renderHook(
      ({ from, to, command }: Props) => {
        const countdown = useCountdown({ from, to, intervalMs: 10 });
        useLayoutEffect(() => {
          if (command === "reset") countdown.reset();
          if (command === "start") countdown.start();
        }, [command, countdown.reset, countdown.start]);
        return countdown;
      },
      {
        initialProps: {
          from: 3,
          to: 0,
          command: "none" as Command,
        },
      },
    );

    rerender({ from: 10, to: 8, command: "reset" });
    expect(result.current.value).toBe(10);
    expect(result.current.isRunning).toBe(false);

    rerender({ from: 20, to: 18, command: "start" });
    expect(result.current.value).toBe(20);
    expect(result.current.isRunning).toBe(true);
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.value).toBe(19);
  });

  it("invokes lifecycle callbacks without a receiver", () => {
    const receivers: unknown[] = [];
    renderHook(() =>
      useCountdown({
        from: 1,
        to: 0,
        intervalMs: 10,
        autoStart: true,
        onChange: function (this: void) {
          receivers.push(this);
        },
        onComplete: function (this: void) {
          receivers.push(this);
        },
      }),
    );

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(receivers).toEqual([undefined, undefined]);
  });

  it("uses latest callbacks and validates inputs", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(
      ({ onChange }) =>
        useCountdown({
          from: 2,
          to: 0,
          intervalMs: 10,
          autoStart: true,
          onChange,
        }),
      { initialProps: { onChange: first } },
    );
    rerender({ onChange: second });
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(1);

    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() =>
        renderHook(() => useCountdown({ from: 1, step: 0 })),
      ).toThrow(RangeError);
      expect(() =>
        renderHook(() => useCountdown({ from: Infinity })),
      ).toThrow(RangeError);
    } finally {
      consoleError.mockRestore();
    }
  });
});
