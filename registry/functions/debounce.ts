export type DebouncedFunction<
  Arguments extends unknown[],
  This = unknown,
> = ((
  this: This,
  ...args: Arguments
) => void) & {
  cancel: () => void;
  flush: () => void;
  pending: () => boolean;
};

/** Delays a function until calls have stopped for the configured duration. */
export const debounce = <This, Arguments extends unknown[]>(
  fn: (this: This, ...args: Arguments) => unknown,
  delayMs: number = 300
): DebouncedFunction<Arguments, This> => {
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new RangeError("delayMs must be a finite, non-negative number");
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  let latestArguments: Arguments | undefined;
  let latestReceiver: This | undefined;

  const invoke = () => {
    const args = latestArguments;
    const receiver = latestReceiver;
    timer = undefined;
    latestArguments = undefined;
    latestReceiver = undefined;
    if (args) {
      Reflect.apply(fn, receiver, args);
    }
  };

  const debounced = function (this: This, ...args: Arguments) {
    latestArguments = args;
    latestReceiver = this;
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(invoke, delayMs);
  };

  return Object.assign(debounced, {
    cancel: () => {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
      latestArguments = undefined;
      latestReceiver = undefined;
    },
    flush: () => {
      if (timer === undefined) return;
      clearTimeout(timer);
      invoke();
    },
    pending: () => timer !== undefined,
  });
};
