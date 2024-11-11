import { renderHook, act } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import useDebouncedValue from ".";

describe("useDebouncedValue", () => {
  beforeAll(() => {
    vi.useFakeTimers(); // Mock the timers before running tests
  });

  afterAll(() => {
    vi.useRealTimers(); // Restore real timers after tests
  });

  it("should update the debounced value after the specified delay", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: "initial", delay: 300 },
      }
    );

    // Initially, the debounced value should be the same as the input value
    expect(result.current).toBe("initial");

    // Change the value
    rerender({ value: "updated", delay: 300 });

    // The debounced value should not change immediately
    expect(result.current).toBe("initial");

    // Fast-forward the timers by the specified delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Now the debounced value should be updated
    expect(result.current).toBe("updated");
  });

  it("should not update the debounced value before the delay", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    // Initially, the debounced value should be the same as the input value
    expect(result.current).toBe("initial");

    // Change the value before the delay has passed
    rerender({ value: "updated", delay: 500 });

    // Fast-forward the timers by less than the delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // The debounced value should still be the initial value
    expect(result.current).toBe("initial");

    // Fast-forward the remaining time
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Now the debounced value should be updated to 'updated'
    expect(result.current).toBe("updated");
  });

  it("should update the debounced value with a custom delay", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    // Initially, the debounced value should be the same as the input value
    expect(result.current).toBe("initial");

    // Change the value and delay
    rerender({ value: "updated", delay: 1000 });

    // Fast-forward the timers by less than the delay
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // The debounced value should still be the initial value
    expect(result.current).toBe("initial");

    // Fast-forward the remaining time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Now the debounced value should be updated to 'updated'
    expect(result.current).toBe("updated");
  });
});
