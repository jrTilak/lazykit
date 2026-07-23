import { useEffect, useState } from "react";

/** Returns the latest value after it has remained unchanged for a delay. */
export const useDebouncedValue = <Value>(
  value: Value,
  delayMs: number = 300,
): Value => {
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new RangeError("delayMs must be a finite, non-negative number");
  }

  const [debouncedValue, setDebouncedValue] = useState<Value>(() => value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(() => value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [delayMs, value]);

  return debouncedValue;
};
