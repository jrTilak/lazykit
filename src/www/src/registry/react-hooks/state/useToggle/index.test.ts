import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useToggle from ".";

describe("useToggle", () => {
  it("should toggle between two values", () => {
    const { result } = renderHook(() => useToggle("On", "Off"));

    // Initial state should be 'On'
    expect(result.current.state).toBe("On");

    // Toggle to 'Off'
    act(() => {
      result.current.toggle();
    });
    expect(result.current.state).toBe("Off");

    // Toggle back to 'On'
    act(() => {
      result.current.toggle();
    });
    expect(result.current.state).toBe("On");
  });

  it("should handle different types of values", () => {
    const { result } = renderHook(() => useToggle(1, 2));

    // Initial state should be 1
    expect(result.current.state).toBe(1);

    // Toggle to 2
    act(() => {
      result.current.toggle();
    });
    expect(result.current.state).toBe(2);

    // Toggle back to 1
    act(() => {
      result.current.toggle();
    });
    expect(result.current.state).toBe(1);
  });
});
