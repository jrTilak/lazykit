import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type UseTimeoutReturn = {
  reset: () => void;
  cancel: () => void;
  isPending: boolean;
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Schedules the latest callback once; a null delay disables the timeout. */
export const useTimeout = (
  callback: (this: void) => void,
  delayMs: number | null,
): UseTimeoutReturn => {
  if (
    delayMs !== null &&
    (!Number.isFinite(delayMs) || delayMs < 0)
  ) {
    throw new RangeError("delayMs must be null or a finite, non-negative number");
  }

  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const mountedRef = useRef(false);
  const [isPending, setIsPending] = useState(delayMs !== null);

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== undefined) clearTimeout(timerRef.current);
    timerRef.current = undefined;
  }, []);

  const cancel = useCallback(() => {
    clearTimer();
    if (mountedRef.current) setIsPending(false);
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    if (!mountedRef.current) return;

    if (delayMs === null) {
      setIsPending(false);
      return;
    }

    setIsPending(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = undefined;
      if (!mountedRef.current) return;
      setIsPending(false);
      Reflect.apply(callbackRef.current, undefined, []);
    }, delayMs);
  }, [clearTimer, delayMs]);

  useIsomorphicLayoutEffect(() => {
    mountedRef.current = true;
    reset();

    return () => {
      mountedRef.current = false;
      clearTimer();
    };
  }, [clearTimer, reset]);

  return { reset, cancel, isPending };
};
