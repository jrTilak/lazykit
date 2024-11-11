import { act, renderHook } from "@testing-library/react";
import useCounter from ".";
import { describe, expect, it } from "vitest";

describe("useCounter()", () => {
  it("should use counter", () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
    expect(typeof result.current.increment).toBe("function");
    expect(typeof result.current.decrement).toBe("function");
    expect(typeof result.current.reset).toBe("function");
    expect(typeof result.current.setCount).toBe("function");
  });

  it("should increment counter", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("should decrement counter", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(-1);
  });

  it("should default value works", () => {
    const { result } = renderHook(() => useCounter(3));

    expect(result.current.count).toBe(3);
  });

  it("should decrement counter with default value", () => {
    const { result } = renderHook(() => useCounter(3));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(2);
  });

  it("should set counter", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.setCount(5);
    });

    expect(result.current.count).toBe(5);
  });

  it("should set counter with prev value", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.setCount((x) => x + 2);
    });

    expect(result.current.count).toBe(7);
  });

  it("should reset counter", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.count).toBe(0);
  });

  it("should respect min limit", () => {
    const { result } = renderHook(() => useCounter(0, { min: 0 }));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(0); // Should not go below min
  });

  it("should respect max limit", () => {
    const { result } = renderHook(() => useCounter(10, { max: 10 }));

    act(() => {
      result.current.increment(); // Try to increment above max
    });

    expect(result.current.count).toBe(10); // Should not go above max
  });

  it("should throw error if min is greater than or equal to max", () => {
    expect(() => renderHook(() => useCounter(0, { min: 1, max: 1 }))).toThrow(
      "min must be less than max and max must be greater than min"
    );
  });
});
