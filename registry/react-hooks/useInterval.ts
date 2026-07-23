import { useEffect, useLayoutEffect, useRef } from "react";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Repeatedly invokes the latest callback; a null delay disables the interval. */
export const useInterval = (
  callback: (this: void) => void,
  intervalMs: number | null,
): void => {
  if (
    intervalMs !== null &&
    (!Number.isFinite(intervalMs) || intervalMs < 0)
  ) {
    throw new RangeError(
      "intervalMs must be null or a finite, non-negative number",
    );
  }

  const callbackRef = useRef(callback);

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (intervalMs === null) return;

    const timer = setInterval(() => {
      Reflect.apply(callbackRef.current, undefined, []);
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [intervalMs]);
};
