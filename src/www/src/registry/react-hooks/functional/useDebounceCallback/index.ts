import debounce from "@/registry/functions/functional/debounce";
import { useCallback } from "react";

function useDebounceCallback<A extends unknown[]>(
  fn: (...args: A) => void,
  delay: number = 300
) {
  const debouncedFn = useCallback(debounce(fn, delay), []);
  return debouncedFn;
}

export default useDebounceCallback;
