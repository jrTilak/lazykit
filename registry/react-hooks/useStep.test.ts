import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, spyOn } from "bun:test";

import { useStep } from "./useStep";

describe("useStep", () => {
  it("moves within its bounds and reports boundary flags", () => {
    const { result } = renderHook(() => useStep(3));

    expect(result.current.currentStep).toBe(0);
    expect(result.current.isFirst).toBe(true);
    act(() => result.current.previous());
    expect(result.current.currentStep).toBe(0);

    act(() => {
      result.current.next();
      result.current.next();
      result.current.next();
    });
    expect(result.current.currentStep).toBe(2);
    expect(result.current.isLast).toBe(true);
  });

  it("wraps in both directions when loop is enabled", () => {
    const { result } = renderHook(() => useStep(3, { loop: true }));

    act(() => result.current.previous());
    expect(result.current.currentStep).toBe(2);
    act(() => result.current.next());
    expect(result.current.currentStep).toBe(0);
    act(() => result.current.setStep(8));
    expect(result.current.currentStep).toBe(2);
  });

  it("supports functional updates, reset, and custom initial steps", () => {
    const { result } = renderHook(() =>
      useStep(5, { initialStep: 2 }),
    );

    act(() => result.current.setStep((step) => step + 2));
    expect(result.current.currentStep).toBe(4);
    act(() => result.current.reset());
    expect(result.current.currentStep).toBe(2);
  });

  it("normalizes the current step when the step count shrinks", () => {
    const { result, rerender } = renderHook(
      ({ count }) => useStep(count),
      { initialProps: { count: 5 } },
    );

    act(() => result.current.setStep(4));
    rerender({ count: 2 });

    expect(result.current.currentStep).toBe(1);
  });

  it("rejects invalid counts and steps", () => {
    const error = spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() => renderHook(() => useStep(0))).toThrow(
        "stepCount must be a positive safe integer",
      );
      expect(() =>
        renderHook(() => useStep(3, { initialStep: 1.5 })),
      ).toThrow("step must be a safe integer");
    } finally {
      error.mockRestore();
    }
  });
});
