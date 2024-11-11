import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useCountdown from ".";

describe("useCountdown", () => {
  it("should start the countdown and decrement by 1 every second", () => {
    const { result } = renderHook(() =>
      useCountdown({ from: 10, to: 0, dir: "dec", config: { interval: 1000 } })
    );

    // Start the countdown
    act(() => {
      result.current.controls.start();
    });

    // Wait for a second and check the time
    setTimeout(() => {
      expect(result.current.time).toBe(9);
    }, 1000);
  });

  it('should increment by 1 every second when dir is "inc"', () => {
    const { result } = renderHook(() =>
      useCountdown({ from: 0, to: 10, dir: "inc", config: { interval: 1000 } })
    );

    // Start the countdown
    act(() => {
      result.current.controls.start();
    });

    // Wait for a second and check the time
    setTimeout(() => {
      expect(result.current.time).toBe(1);
    }, 1000);
  });

  it("should call onChange callback on time change", () => {
    const onChangeMock = vi.fn();
    const { result } = renderHook(() =>
      useCountdown({
        from: 10,
        to: 0,
        dir: "dec",
        config: { interval: 1000, onChange: onChangeMock },
      })
    );

    act(() => {
      result.current.controls.start();
    });

    // Wait for a second
    setTimeout(() => {
      expect(onChangeMock).toHaveBeenCalledWith(9);
    }, 1000);
  });

  it("should call onEnd callback when countdown reaches the end", () => {
    const onEndMock = vi.fn();
    const { result } = renderHook(() =>
      useCountdown({
        from: 10,
        to: 0,
        dir: "dec",
        config: { interval: 1000, onEnd: onEndMock },
      })
    );

    act(() => {
      result.current.controls.start();
    });

    // Wait for countdown to end
    setTimeout(() => {
      expect(onEndMock).toHaveBeenCalled();
    }, 10000); // This should be enough for the countdown to reach 0
  });

  it("should pause the countdown and prevent further changes", () => {
    const { result } = renderHook(() =>
      useCountdown({ from: 10, to: 0, dir: "dec", config: { interval: 1000 } })
    );

    act(() => {
      result.current.controls.start();
    });

    // Pause after 2 seconds
    setTimeout(() => {
      act(() => {
        result.current.controls.pause();
      });
      expect(result.current.isCounting).toBe(false);
      const pausedTime = result.current.time;

      // Wait for another second and ensure time hasn't changed
      setTimeout(() => {
        expect(result.current.time).toBe(pausedTime); // Time should not change while paused
      }, 1000);
    }, 2000);
  });

  it("should reset the countdown to the starting value", () => {
    const { result } = renderHook(() =>
      useCountdown({ from: 10, to: 0, dir: "dec", config: { interval: 1000 } })
    );

    act(() => {
      result.current.controls.start();
    });

    // Wait for 2 seconds
    setTimeout(() => {
      act(() => {
        result.current.controls.reset();
      });

      // Time should be reset to the starting value (10)
      expect(result.current.time).toBe(10);
    }, 2000);
  });

  it("should stop the countdown and reset the time to the starting value", () => {
    const { result } = renderHook(() =>
      useCountdown({ from: 10, to: 0, dir: "dec", config: { interval: 1000 } })
    );

    act(() => {
      result.current.controls.start();
    });

    // Wait for 2 seconds
    setTimeout(() => {
      act(() => {
        result.current.controls.stop();
      });

      // Time should be reset to the starting value (10)
      expect(result.current.time).toBe(10);
      expect(result.current.isCounting).toBe(false);
    }, 2000);
  });

  it("should auto-start the countdown when autoStart is true", () => {
    const { result } = renderHook(() =>
      useCountdown({
        from: 5,
        to: 0,
        dir: "dec",
        config: { interval: 1000, autoStart: true },
      })
    );

    // Wait for the countdown to complete
    setTimeout(() => {
      expect(result.current.time).toBe(0);
    }, 5000);
  });
});
