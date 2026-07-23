import { useEffect, useLayoutEffect, useMemo, useRef } from "react";

export type ThrottledCallback<
  Arguments extends unknown[],
  Return,
  This = unknown,
> = ((
  this: This,
  ...args: Arguments
) => Return | undefined) & {
  reset: () => void;
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Returns a leading-edge callback that drops calls during its interval. */
export const useThrottledCallback = <
  This,
  Arguments extends unknown[],
  Return,
>(
  callback: (this: This, ...args: Arguments) => Return,
  intervalMs: number,
): ThrottledCallback<Arguments, Return, This> => {
  if (!Number.isFinite(intervalMs) || intervalMs < 0) {
    throw new RangeError("intervalMs must be a finite, non-negative number");
  }

  const callbackRef = useRef(callback);
  const intervalRef = useRef(intervalMs);
  const previousIntervalRef = useRef(intervalMs);

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttled = useMemo<ThrottledCallback<Arguments, Return, This>>(() => {
    let lastInvocation: number | undefined;

    const wrapped = function (
      this: This,
      ...args: Arguments
    ): Return | undefined {
      const now = Date.now();
      if (
        lastInvocation !== undefined &&
        now >= lastInvocation &&
        now - lastInvocation < intervalRef.current
      ) {
        return undefined;
      }

      lastInvocation = now;
      return Reflect.apply(callbackRef.current, this, args) as Return;
    };

    return Object.assign(wrapped, {
      reset: () => {
        lastInvocation = undefined;
      },
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!Object.is(previousIntervalRef.current, intervalMs)) {
      throttled.reset();
      previousIntervalRef.current = intervalMs;
    }
    intervalRef.current = intervalMs;
  }, [intervalMs, throttled]);

  return throttled;
};
