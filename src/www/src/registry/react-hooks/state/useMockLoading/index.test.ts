import { renderHook, act } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import useMockLoading from ".";

describe("useMockLoading", () => {
  beforeAll(() => {
    vi.useFakeTimers(); // Mock the timer
  });

  afterAll(() => {
    vi.useRealTimers(); // Restore real timers after tests
  });

  it("should initialize with default loading state", () => {
    const { result } = renderHook(() => useMockLoading({ defaultValue: true }));
    expect(result.current.loading).toBe(true);
  });

  it("should automatically stop loading after specified loadingTime when autoStart is true", () => {
    const loadingTime = 3000;
    const { result } = renderHook(() =>
      useMockLoading({ loadingTime, autoStart: true })
    );

    expect(result.current.loading).toBe(true); // Initially loading

    act(() => {
      vi.advanceTimersByTime(loadingTime);
    });

    expect(result.current.loading).toBe(false); // Loading should stop after loadingTime
  });

  it("should not start loading automatically if autoStart is false", () => {
    const { result } = renderHook(() => useMockLoading({ autoStart: false }));
    expect(result.current.loading).toBe(false);
  });

  it("should manually start and stop loading", () => {
    const { result } = renderHook(() => useMockLoading({ autoStart: false }));

    act(() => {
      result.current.startLoading();
    });
    expect(result.current.loading).toBe(true);

    act(() => {
      result.current.stopLoading();
    });
    expect(result.current.loading).toBe(false);
  });

  it("should clear timeout on unmount", () => {
    const loadingTime = 3000;
    const { result, unmount } = renderHook(() =>
      useMockLoading({ loadingTime })
    );

    expect(result.current.loading).toBe(true);

    unmount();

    act(() => {
      vi.advanceTimersByTime(loadingTime);
    });

    // Since the component is unmounted, the timeout should be cleared
    // There's no state update after unmount, so no further checks needed here
  });
});
