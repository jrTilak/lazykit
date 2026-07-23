import { useCallback, useState } from "react";

import type { Dispatch, SetStateAction } from "react";

export interface UseBooleanResult {
  readonly value: boolean;
  readonly setValue: Dispatch<SetStateAction<boolean>>;
  readonly setTrue: () => void;
  readonly setFalse: () => void;
  readonly toggle: () => void;
}

export function useBoolean(initialValue = false): UseBooleanResult {
  if (typeof initialValue !== "boolean") {
    throw new TypeError("initialValue must be a boolean");
  }

  const [value, setInternalValue] = useState(initialValue);
  const setValue = useCallback<Dispatch<SetStateAction<boolean>>>((action) => {
    setInternalValue((current) => {
      const next =
        typeof action === "function" ? action(current) : action;
      if (typeof next !== "boolean") {
        throw new TypeError("value must be a boolean");
      }
      return next;
    });
  }, []);
  const setTrue = useCallback(() => setInternalValue(true), []);
  const setFalse = useCallback(() => setInternalValue(false), []);
  const toggle = useCallback(
    () => setInternalValue((current) => !current),
    [],
  );

  return { value, setValue, setTrue, setFalse, toggle };
}
