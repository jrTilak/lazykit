import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

type Callable = (...args: never[]) => unknown;

export type EventCallback<Callback extends Callable> = Callback;

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useEventCallback<Callback extends Callable>(
  callback: Callback,
): EventCallback<Callback> {
  const callbackRef = useRef(callback);

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(function (
    this: unknown,
    ...args: readonly unknown[]
  ): unknown {
    return Reflect.apply(callbackRef.current, this, args);
  }, []) as unknown as Callback;
}
