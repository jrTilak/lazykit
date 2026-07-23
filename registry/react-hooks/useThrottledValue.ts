import { useEffect, useRef, useState } from "react";

/** Returns a value that updates at most once during each interval. */
export const useThrottledValue = <Value>(
  value: Value,
  intervalMs: number,
): Value => {
  if (!Number.isFinite(intervalMs) || intervalMs < 0) {
    throw new RangeError("intervalMs must be a finite, non-negative number");
  }

  const [throttledValue, setThrottledValue] = useState<Value>(() => value);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    if (Object.is(value, throttledValue)) return;

    const now = Date.now();
    const elapsed = now - lastUpdateRef.current;
    if (elapsed < 0 || elapsed >= intervalMs) {
      lastUpdateRef.current = now;
      setThrottledValue(() => value);
      return;
    }

    const timer = setTimeout(() => {
      lastUpdateRef.current = Date.now();
      setThrottledValue(() => value);
    }, intervalMs - elapsed);

    return () => {
      clearTimeout(timer);
    };
  }, [intervalMs, throttledValue, value]);

  return throttledValue;
};
