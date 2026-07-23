import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type UseIdleOptions = {
  enabled?: boolean;
  initialState?: boolean;
  events?: readonly (keyof WindowEventMap)[];
  onIdle?: (this: void) => void;
  onActive?: (this: void) => void;
};

export type UseIdleReturn = {
  isIdle: boolean;
  reset: () => void;
};

const defaultActivityEvents = [
  "keydown",
  "pointerdown",
  "pointermove",
  "scroll",
  "touchstart",
  "focus",
] as const satisfies readonly (keyof WindowEventMap)[];

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Marks the user idle after a period without configured window activity. */
export const useIdle = (
  timeoutMs: number,
  options: UseIdleOptions = {},
): UseIdleReturn => {
  if (!Number.isFinite(timeoutMs) || timeoutMs < 0) {
    throw new RangeError("timeoutMs must be a finite, non-negative number");
  }

  const enabled = options.enabled ?? true;
  const events = [...new Set(options.events ?? defaultActivityEvents)];
  const eventsKey = events.join("\u0000");
  const [isIdle, setIsIdle] = useState(options.initialState ?? false);
  const isIdleRef = useRef(isIdle);
  const onIdleRef = useRef(options.onIdle);
  const onActiveRef = useRef(options.onActive);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const mountedRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    onIdleRef.current = options.onIdle;
    onActiveRef.current = options.onActive;
  }, [options.onActive, options.onIdle]);

  useIsomorphicLayoutEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== undefined) clearTimeout(timerRef.current);
    timerRef.current = undefined;
  }, []);

  const scheduleIdle = useCallback(() => {
    clearTimer();
    if (!mountedRef.current || !enabled) return;

    timerRef.current = setTimeout(() => {
      timerRef.current = undefined;
      if (mountedRef.current && !isIdleRef.current) {
        isIdleRef.current = true;
        setIsIdle(true);
        if (onIdleRef.current !== undefined) {
          Reflect.apply(onIdleRef.current, undefined, []);
        }
      }
    }, timeoutMs);
  }, [clearTimer, enabled, timeoutMs]);

  const reset = useCallback(() => {
    if (!mountedRef.current) return;
    if (isIdleRef.current) {
      isIdleRef.current = false;
      setIsIdle(false);
      if (onActiveRef.current !== undefined) {
        Reflect.apply(onActiveRef.current, undefined, []);
      }
    }
    scheduleIdle();
  }, [scheduleIdle]);

  useEffect(() => {
    if (typeof window === "undefined" || !enabled) {
      clearTimer();
      isIdleRef.current = false;
      setIsIdle(false);
      return;
    }

    const handleActivity = () => {
      reset();
    };

    for (const eventName of events) {
      window.addEventListener(eventName, handleActivity, { passive: true });
    }
    scheduleIdle();

    return () => {
      clearTimer();
      for (const eventName of events) {
        window.removeEventListener(eventName, handleActivity);
      }
    };
  }, [
    clearTimer,
    enabled,
    eventsKey,
    reset,
    scheduleIdle,
  ]);

  return { isIdle, reset };
};
