import { useCallback, useEffect, useState } from "react";

import type { Dispatch, SetStateAction } from "react";

export interface UseCounterOptions {
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
}

export interface UseCounterResult {
  readonly count: number;
  readonly setCount: Dispatch<SetStateAction<number>>;
  readonly increment: (amount?: number) => void;
  readonly decrement: (amount?: number) => void;
  readonly reset: () => void;
}

function assertFinite(value: number, name: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be a finite number`);
  }
}

function clamp(value: number, min: number | undefined, max: number | undefined) {
  return Math.min(max ?? Infinity, Math.max(min ?? -Infinity, value));
}

export function useCounter(
  initialValue = 0,
  options: UseCounterOptions = {},
): UseCounterResult {
  const { min, max, step = 1 } = options;

  assertFinite(initialValue, "initialValue");
  assertFinite(step, "step");
  if (step <= 0) throw new RangeError("step must be greater than zero");
  if (min !== undefined) assertFinite(min, "min");
  if (max !== undefined) assertFinite(max, "max");
  if (min !== undefined && max !== undefined && min > max) {
    throw new RangeError("min must be less than or equal to max");
  }

  const boundedInitial = clamp(initialValue, min, max);
  const [storedCount, setInternalCount] = useState(boundedInitial);
  const count = clamp(storedCount, min, max);

  useEffect(() => {
    setInternalCount((current) => {
      const boundedCurrent = clamp(current, min, max);
      return Object.is(current, boundedCurrent)
        ? current
        : boundedCurrent;
    });
  }, [max, min]);

  const setCount = useCallback<Dispatch<SetStateAction<number>>>(
    (action) => {
      setInternalCount((current) => {
        const boundedCurrent = clamp(current, min, max);
        const next =
          typeof action === "function" ? action(boundedCurrent) : action;
        assertFinite(next, "count");
        return clamp(next, min, max);
      });
    },
    [max, min],
  );

  const increment = useCallback(
    (amount = step) => {
      assertFinite(amount, "amount");
      if (amount < 0) {
        throw new RangeError("amount must be greater than or equal to zero");
      }
      setCount((current) => current + amount);
    },
    [setCount, step],
  );

  const decrement = useCallback(
    (amount = step) => {
      assertFinite(amount, "amount");
      if (amount < 0) {
        throw new RangeError("amount must be greater than or equal to zero");
      }
      setCount((current) => current - amount);
    },
    [setCount, step],
  );

  const reset = useCallback(() => {
    setInternalCount(clamp(initialValue, min, max));
  }, [initialValue, max, min]);

  return { count, setCount, increment, decrement, reset };
}
