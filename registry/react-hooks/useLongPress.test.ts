import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";

import { useLongPress } from "./useLongPress";

import type { PointerEvent as ReactPointerEvent } from "react";

const pointerEvent = (
  overrides: Partial<ReactPointerEvent<HTMLElement>> = {},
): ReactPointerEvent<HTMLElement> =>
  ({
    button: 0,
    clientX: 0,
    clientY: 0,
    pointerId: 1,
    ...overrides,
  }) as ReactPointerEvent<HTMLElement>;

describe("useLongPress", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("fires after the delay and reports finish", () => {
    const handler = vi.fn();
    const onFinish = vi.fn();
    const { result } = renderHook(() =>
      useLongPress(handler, { delayMs: 200, onFinish }),
    );
    act(() => result.current.onPointerDown(pointerEvent()));
    act(() => vi.advanceTimersByTime(200));
    expect(handler).toHaveBeenCalledTimes(1);
    act(() => result.current.onPointerUp(pointerEvent()));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it("cancels on movement, disabled state, and unmount", () => {
    const handler = vi.fn();
    const onCancel = vi.fn();
    const { result, rerender, unmount } = renderHook(
      ({ disabled }) =>
        useLongPress(handler, {
          delayMs: 200,
          disabled,
          movementThreshold: 5,
          onCancel,
        }),
      { initialProps: { disabled: false } },
    );
    act(() => result.current.onPointerDown(pointerEvent()));
    act(() =>
      result.current.onPointerMove(pointerEvent({ clientX: 10 })),
    );
    act(() => vi.advanceTimersByTime(200));
    expect(handler).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledTimes(1);
    act(() => result.current.onPointerDown(pointerEvent()));
    rerender({ disabled: true });
    act(() => vi.advanceTimersByTime(200));
    expect(handler).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledTimes(2);
    unmount();
  });

  it("invokes lifecycle callbacks without an internal ref receiver", () => {
    const receivers: unknown[] = [];
    function callback(this: void): void {
      receivers.push(this);
    }
    const { result } = renderHook(() =>
      useLongPress(callback, {
        delayMs: 0,
        onFinish: callback,
        onStart: callback,
      }),
    );

    act(() => result.current.onPointerDown(pointerEvent()));
    act(() => vi.advanceTimersByTime(0));
    act(() => result.current.onPointerUp(pointerEvent()));
    expect(receivers).toEqual([undefined, undefined, undefined]);
  });
});
