import { useCallback, useState } from "react";

import type { Dispatch, SetStateAction } from "react";

type UseCounterReturn = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: Dispatch<SetStateAction<number>>;
};

/**
 * Custom hook that manages a counter with increment, decrement, reset, and setCount functionalities.
 */
const useCounter = (
  initialValue?: number,
  config?: Partial<{
    min: number;
    max: number;
  }>
): UseCounterReturn => {
  const [count, setCountFromUseState] = useState(initialValue ?? 0);

  if (
    config &&
    typeof config.min === "number" &&
    typeof config.max === "number" &&
    config.min >= config.max &&
    config.max <= config.min
  ) {
    throw new Error(
      "min must be less than max and max must be greater than min"
    );
  }

  const setCount = useCallback(
    (value: SetStateAction<number>) => {
      setCountFromUseState((prev) => {
        const newValue = typeof value === "function" ? value(prev) : value;

        if (config?.min !== undefined && newValue < config.min) {
          return config.min;
        }

        if (config?.max !== undefined && newValue > config.max) {
          return config.max;
        }

        return newValue;
      });
    },
    [config]
  );

  const increment = useCallback(() => {
    setCount((x) => x + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((x) => x - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue ?? 0);
  }, [initialValue]);

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  };
};

export default useCounter;
