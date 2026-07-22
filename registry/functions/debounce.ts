type DebouncedFunction<Arguments extends unknown[]> = ((
  ...args: Arguments
) => void) & {
  cancel: () => void;
  flush: () => void;
  pending: () => boolean;
};

/** Delays a function until calls have stopped for the configured duration. */
export const debounce = <Arguments extends unknown[]>(
  fn: (...args: Arguments) => void,
  delayMs: number = 300
): DebouncedFunction<Arguments> => {
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new RangeError("delayMs must be a finite, non-negative number");
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  let latestArguments: Arguments | undefined;

  const invoke = () => {
    const args = latestArguments;
    timer = undefined;
    latestArguments = undefined;
    if (args) fn(...args);
  };

  const debounced = (...args: Arguments) => {
    latestArguments = args;
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(invoke, delayMs);
  };

  return Object.assign(debounced, {
    cancel: () => {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
      latestArguments = undefined;
    },
    flush: () => {
      if (timer === undefined) return;
      clearTimeout(timer);
      invoke();
    },
    pending: () => timer !== undefined,
  });
};
