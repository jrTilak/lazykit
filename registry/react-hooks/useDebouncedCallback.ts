import { useEffect, useLayoutEffect, useMemo, useRef } from "react";

export type DebouncedCallback<Arguments extends unknown[], This = unknown> = ((
  this: This,
  ...args: Arguments
) => void) & {
  cancel: () => void;
  flush: () => void;
  pending: () => boolean;
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Returns a debounced callback that always invokes the latest function. */
export const useDebouncedCallback = <This, Arguments extends unknown[]>(
  callback: (this: This, ...args: Arguments) => unknown,
  delayMs: number = 300,
): DebouncedCallback<Arguments, This> => {
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new RangeError("delayMs must be a finite, non-negative number");
  }

  const callbackRef = useRef(callback);
  const delayRef = useRef(delayMs);
  const previousDelayRef = useRef(delayMs);
  const mountedRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debounced = useMemo<DebouncedCallback<Arguments, This>>(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let latestArguments: Arguments | undefined;
    let latestReceiver: This | undefined;

    const invoke = () => {
      const args = latestArguments;
      const receiver = latestReceiver;
      timer = undefined;
      latestArguments = undefined;
      latestReceiver = undefined;

      if (args !== undefined) {
        Reflect.apply(callbackRef.current, receiver, args);
      }
    };

    const wrapped = function (this: This, ...args: Arguments) {
      if (!mountedRef.current) return;
      latestArguments = args;
      latestReceiver = this;
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(invoke, delayRef.current);
    };

    return Object.assign(wrapped, {
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
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!Object.is(previousDelayRef.current, delayMs)) {
      debounced.cancel();
      previousDelayRef.current = delayMs;
    }
    delayRef.current = delayMs;
  }, [debounced, delayMs]);

  useIsomorphicLayoutEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      debounced.cancel();
    };
  }, [debounced]);

  return debounced;
};
