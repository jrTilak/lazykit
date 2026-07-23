import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, mock } from "bun:test";

import { useEventCallback } from "./useEventCallback";

describe("useEventCallback", () => {
  it("keeps its identity while calling the latest callback", () => {
    const first = mock((value: number) => value + 1);
    const second = mock((value: number) => value * 2);
    const { result, rerender } = renderHook(
      ({ callback }) => useEventCallback(callback),
      { initialProps: { callback: first } },
    );
    const stableCallback = result.current;

    expect(result.current(3)).toBe(4);

    rerender({ callback: second });

    expect(result.current).toBe(stableCallback);
    expect(result.current(3)).toBe(6);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("forwards arguments, return values, thrown errors, and receivers", () => {
    const error = new Error("boom");
    const { result, rerender } = renderHook(
      ({ callback }) => useEventCallback(callback),
      {
        initialProps: {
          callback(this: { offset: number }, left: number, right: number) {
            return this.offset + left + right;
          },
        },
      },
    );

    expect(result.current.call({ offset: 2 }, 3, 4)).toBe(9);

    rerender({
      callback() {
        throw error;
      },
    });

    expect(() => result.current.call({ offset: 0 }, 1, 2)).toThrow(error);
  });

  it("can be called during a batched update", () => {
    const callback = mock((value: string) => value.toUpperCase());
    const { result } = renderHook(() => useEventCallback(callback));
    let returned = "";

    act(() => {
      returned = result.current("ready");
    });

    expect(returned).toBe("READY");
    expect(callback).toHaveBeenCalledWith("ready");
  });
});
