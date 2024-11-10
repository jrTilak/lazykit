import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useStep from ".";

describe("useStep", () => {
  it("should initialize with the correct step", () => {
    const { result } = renderHook(() =>
      useStep({
        totalSteps: 5,
      })
    );
    expect(result.current.currentStep).toBe(0); // Initial step is 0
  });

  it("should move to the next step", () => {
    const { result } = renderHook(() =>
      useStep({
        totalSteps: 5,
      })
    );
    act(() => result.current.nextStep());
    expect(result.current.currentStep).toBe(1); // Should move to step 1
  });

  it("should move to the previous step", () => {
    const { result } = renderHook(() =>
      useStep({
        totalSteps: 5,
      })
    );
    act(() => result.current.nextStep()); // Move to step 1
    act(() => result.current.prevStep()); // Go back to step 0
    expect(result.current.currentStep).toBe(0); // Should move back to step 0
  });

  it("should handle rotation from the last step to the first", () => {
    const { result } = renderHook(() =>
      useStep({
        totalSteps: 3,
        rotate: true,
      })
    );
    act(() => result.current.nextStep()); // Step 1
    act(() => result.current.nextStep()); // Step 2
    act(() => result.current.nextStep()); // Should rotate back to step 0
    expect(result.current.currentStep).toBe(0);
  });

  it("should trigger the onChange callback when the step changes", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useStep({
        totalSteps: 5,
        onChange,
      })
    );
    act(() => result.current.nextStep());
    expect(onChange).toHaveBeenCalledWith(1); // Should call onChange with step 2
  });
});
