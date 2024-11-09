import { renderHook, act } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import useDebounce from ".";

describe("useDebounce", () => {
  beforeAll(() => {
    vi.useFakeTimers(); // Mock the timers before running tests
  });

  afterAll(() => {
    vi.useRealTimers(); // Restore real timers after tests
  });

  it("should debounce the function", async () => {
    const fn = vi.fn();
    const delay = 300;
    const { result } = renderHook(() => useDebounce(fn, delay));

    // Call the debounced function multiple times in quick succession
    act(() => {
      result.current();
      result.current();
      result.current();
    });

    // Check that the function has not been called yet (debounced)
    expect(fn).toHaveBeenCalledTimes(0);

    // Fast-forward the timers by the delay time
    act(() => {
      vi.advanceTimersByTime(delay);
    });

    // Now check that the function has been called exactly once after the delay
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should cancel the debounce if the function is called before the delay", async () => {
    const fn = vi.fn();
    const delay = 300;
    const { result } = renderHook(() => useDebounce(fn, delay));

    // Call the debounced function twice in quick succession
    act(() => {
      result.current();
      result.current();
    });

    // Fast-forward the timers by half the delay (shouldn't call the function yet)
    act(() => {
      vi.advanceTimersByTime(delay / 2);
    });

    // Function should not be called yet
    expect(fn).toHaveBeenCalledTimes(0);

    // Fast-forward the timers to the full delay
    act(() => {
      vi.advanceTimersByTime(delay / 2);
    });

    // Function should be called once, after the full delay
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should respect a custom delay", async () => {
    const fn = vi.fn();
    const delay = 500;
    const { result } = renderHook(() => useDebounce(fn, delay));

    // Call the debounced function
    act(() => {
      result.current();
    });

    // Fast-forward the timers by less than the delay (should not call the function yet)
    act(() => {
      vi.advanceTimersByTime(delay - 100);
    });
    expect(fn).toHaveBeenCalledTimes(0);

    // Fast-forward the remaining time and check that the function is called after the full delay
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
