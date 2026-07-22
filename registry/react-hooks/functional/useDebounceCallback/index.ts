import { debounce } from "../../../functions/debounce";
import { useCallback } from "react";

export function useDebounceCallback<A extends unknown[]>(
  fn: (...args: A) => void,
  delay: number = 300
) {
  const debouncedFn = useCallback(debounce(fn, delay), []);
  return debouncedFn;
}
