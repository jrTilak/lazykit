type ThrottledFunction<Arguments extends unknown[], Return> = ((
  ...args: Arguments
) => Return | undefined) & {
  reset: () => void;
};

/** Runs immediately, then drops calls until the interval has elapsed. */
export const throttle = <Arguments extends unknown[], Return>(
  fn: (...args: Arguments) => Return,
  intervalMs: number
): ThrottledFunction<Arguments, Return> => {
  if (!Number.isFinite(intervalMs) || intervalMs < 0) {
    throw new RangeError("intervalMs must be a finite, non-negative number");
  }

  let lastInvocation: number | undefined;
  const throttled = (...args: Arguments): Return | undefined => {
    const now = Date.now();
    if (
      lastInvocation !== undefined &&
      now >= lastInvocation &&
      now - lastInvocation < intervalMs
    ) {
      return undefined;
    }
    lastInvocation = now;
    return fn(...args);
  };

  return Object.assign(throttled, {
    reset: () => {
      lastInvocation = undefined;
    },
  });
};
