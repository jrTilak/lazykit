export type ThrottledFunction<
  Arguments extends unknown[],
  Return,
  This = unknown,
> = ((
  this: This,
  ...args: Arguments
) => Return | undefined) & {
  reset: () => void;
};

/** Runs immediately, then drops calls until the interval has elapsed. */
export const throttle = <This, Arguments extends unknown[], Return>(
  fn: (this: This, ...args: Arguments) => Return,
  intervalMs: number
): ThrottledFunction<Arguments, Return, This> => {
  if (!Number.isFinite(intervalMs) || intervalMs < 0) {
    throw new RangeError("intervalMs must be a finite, non-negative number");
  }

  let lastInvocation: number | undefined;
  const throttled = function (
    this: This,
    ...args: Arguments
  ): Return | undefined {
    const now = Date.now();
    if (
      lastInvocation !== undefined &&
      now >= lastInvocation &&
      now - lastInvocation < intervalMs
    ) {
      return undefined;
    }
    lastInvocation = now;
    return Reflect.apply(fn, this, args) as Return;
  };

  return Object.assign(throttled, {
    reset: () => {
      lastInvocation = undefined;
    },
  });
};
