import { useState, useEffect, useCallback, useRef } from "react";

interface CountdownConfig {
  from: number; // Starting value of the countdown
  to?: number; // Ending value of the countdown
  dir?: "inc" | "dec" | "auto"; // Direction of counting (increment, decrement, or auto)
  config?: {
    changeBy?: number; // Amount to increment or decrement by
    interval?: number; // Interval time in ms (default 1000ms)
    onChange?: (time: number) => void; // Callback triggered when the time changes
    onStart?: () => void; // Callback triggered when the countdown starts
    onEnd?: () => void; // Callback triggered when the countdown ends
    autoStart?: boolean; // Whether the countdown starts automatically (default: false)
    loop?: boolean; // Whether to run the counter in a loop or not (default: false)
  };
}

interface UseCountdownReturn {
  time: number; // The current countdown time
  isCounting: boolean; // Whether the countdown is currently active
  controls: {
    start: () => void; // Function to start the countdown
    pause: () => void; // Function to pause the countdown
    stop: () => void; // Function to stop the countdown
    reset: () => void; // Function to reset the countdown to the starting value
  };
}

/**
 * A custom hook to manage countdowns or count-ups with configurable options.
 */
const useCountdown = (props: CountdownConfig): UseCountdownReturn => {
  const { from, to = 0, dir = "dec", config = {} } = props;
  const {
    changeBy = 1,
    interval = 1000,
    onChange,
    onStart,
    onEnd,
    autoStart = false,
    loop = false,
  } = config;

  const [time, setTime] = useState(from);
  const [isCounting, setIsCounting] = useState(false);
  const timerRef = useRef<any | null>(null);

  // Determine the counting direction
  const direction = dir === "auto" ? (from < to ? "inc" : "dec") : dir;

  // Start countdown function
  const start = useCallback(() => {
    if (isCounting) return;

    setIsCounting(true);
    if (onStart) onStart();

    const startInterval = () => {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          let newTime =
            direction === "inc" ? prevTime + changeBy : prevTime - changeBy;

          // Check if we've reached the end value
          if (
            (direction === "inc" && newTime >= to) ||
            (direction === "dec" && newTime <= to)
          ) {
            clearInterval(timerRef.current!);
            if (onEnd) onEnd();
            if (loop) {
              setTime(from); // Reset time and restart the countdown
              startInterval(); // Restart the interval with the new time
            } else {
              setIsCounting(false);
            }
          }

          if (onChange) onChange(newTime); // Trigger onChange callback
          return newTime;
        });
      }, interval);
    };

    startInterval(); // Start the initial interval
  }, [changeBy, direction, from, interval, isCounting, loop, to]);

  // Pause countdown function
  const pause = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setIsCounting(false);
    }
  }, []);

  // Stop countdown function
  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setIsCounting(false);
    }
    setTime(from);
  }, [from]);

  // Reset countdown function
  const reset = useCallback(() => {
    setTime(from);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setIsCounting(false);
    }
  }, [from]);

  // Auto-start the countdown if `autoStart` is true
  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, [autoStart, start]);

  return { time, isCounting, controls: { start, pause, stop, reset } };
};

export default useCountdown;
