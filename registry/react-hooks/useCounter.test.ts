import { useLayoutEffect } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, spyOn } from "bun:test";

import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("increments, decrements, and resets with a configured step", () => {
    const { result } = renderHook(() => useCounter(10, { step: 2 }));

    act(() => result.current.increment());
    expect(result.current.count).toBe(12);
    act(() => result.current.decrement());
    expect(result.current.count).toBe(10);
    act(() => result.current.increment(5));
    expect(result.current.count).toBe(15);
    act(() => result.current.reset());
    expect(result.current.count).toBe(10);
  });

  it("clamps its initial value and every update to the bounds", () => {
    const { result } = renderHook(() =>
      useCounter(20, { min: 0, max: 10, step: 4 }),
    );

    expect(result.current.count).toBe(10);
    act(() => result.current.increment());
    expect(result.current.count).toBe(10);
    act(() => result.current.setCount(-100));
    expect(result.current.count).toBe(0);
    act(() => result.current.decrement());
    expect(result.current.count).toBe(0);
  });

  it("composes batched functional updates", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
      result.current.increment(2);
      result.current.setCount((count) => count * 3);
    });

    expect(result.current.count).toBe(9);
  });

  it("uses the latest initial value and options when reset", () => {
    const { result, rerender } = renderHook(
      ({ initialValue, max }) => useCounter(initialValue, { max }),
      { initialProps: { initialValue: 2, max: 10 } },
    );

    act(() => result.current.increment(5));
    rerender({ initialValue: 20, max: 8 });
    act(() => result.current.reset());

    expect(result.current.count).toBe(8);
  });

  it("clamps the current count when bounds become narrower", () => {
    const { result, rerender } = renderHook(
      ({ max }) => useCounter(8, { max }),
      { initialProps: { max: 10 } },
    );

    rerender({ max: 3 });

    expect(result.current.count).toBe(3);
  });

  it("applies functional updates to the displayed bounded count", () => {
    const { result, rerender } = renderHook(
      ({ max, decrementNow }) => {
        const counter = useCounter(8, { max });
        useLayoutEffect(() => {
          if (decrementNow) counter.decrement();
        }, [counter.decrement, decrementNow]);
        return counter;
      },
      { initialProps: { max: 10, decrementNow: false } },
    );

    rerender({ max: 3, decrementNow: true });

    expect(result.current.count).toBe(2);
  });

  it("rejects invalid configuration and non-finite updates", () => {
    const error = spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() =>
        renderHook(() => useCounter(0, { min: 2, max: 1 })),
      ).toThrow("min must be less than or equal to max");
      expect(() => renderHook(() => useCounter(Number.NaN))).toThrow(
        "initialValue must be a finite number",
      );
      expect(() => renderHook(() => useCounter(0, { step: 0 }))).toThrow(
        "step must be greater than zero",
      );
      expect(() => renderHook(() => useCounter(0, { step: -1 }))).toThrow(
        "step must be greater than zero",
      );
      expect(() => renderHook(() => useCounter(0, { step: Infinity }))).toThrow(
        "step must be a finite number",
      );
    } finally {
      error.mockRestore();
    }

    const { result } = renderHook(() => useCounter());
    expect(() => {
      act(() => result.current.increment(Infinity));
    }).toThrow("amount must be a finite number");
    expect(() => {
      act(() => result.current.decrement(Number.NaN));
    }).toThrow("amount must be a finite number");
    expect(() => {
      act(() => result.current.increment(-1));
    }).toThrow("amount must be greater than or equal to zero");
  });
});
