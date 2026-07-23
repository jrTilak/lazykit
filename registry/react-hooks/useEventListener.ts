import { useEffect, useLayoutEffect, useRef } from "react";

import type { RefObject } from "react";

export type EventListenerTarget<Target extends EventTarget> =
  | Target
  | RefObject<Target | null>
  | null
  | undefined;

export type EventMapFor<Target extends EventTarget> =
  Target extends Window
    ? WindowEventMap
    : Target extends Document
      ? DocumentEventMap
      : Target extends MediaQueryList
        ? MediaQueryListEventMap
      : Target extends HTMLElement
        ? HTMLElementEventMap
        : Target extends SVGElement
          ? SVGElementEventMap
          : Target extends Element
            ? ElementEventMap
            : Record<string, Event>;

export interface UseEventListenerOptions extends AddEventListenerOptions {
  enabled?: boolean;
}

interface ActiveEventSubscription {
  capture: boolean;
  listener: EventListener;
  once: boolean;
  passive: boolean;
  signal: AbortSignal | undefined;
  target: EventTarget;
  type: string;
}

const useSafeLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const resolveTarget = <Target extends EventTarget>(
  target: EventListenerTarget<Target>,
): Target | null => {
  if (target === null || target === undefined) return null;
  if (
    "addEventListener" in target &&
    typeof target.addEventListener === "function"
  ) {
    return target as Target;
  }
  return (target as RefObject<Target | null>).current;
};

/** Subscribes to a typed DOM event while always calling the latest handler. */
export const useEventListener = <
  Target extends EventTarget,
  Type extends Extract<keyof EventMapFor<Target>, string>,
>(
  target: EventListenerTarget<Target>,
  type: Type,
  handler: (this: void, event: EventMapFor<Target>[Type]) => void,
  options: UseEventListenerOptions = {},
): void => {
  const handlerRef = useRef(handler);
  const subscriptionRef = useRef<ActiveEventSubscription | null>(null);
  useSafeLayoutEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const {
    enabled = true,
    capture = false,
    once = false,
    passive = false,
    signal,
  } = options;

  // Reconcile after each commit so a stable RefObject may point at a new node.
  // An unchanged subscription stays attached, including a consumed `once`
  // listener.
  useEffect(() => {
    const currentTarget = enabled ? resolveTarget(target) : null;
    const active = subscriptionRef.current;
    if (
      currentTarget !== null &&
      active?.target === currentTarget &&
      active.type === type &&
      active.capture === capture &&
      active.once === once &&
      active.passive === passive &&
      active.signal === signal
    ) {
      return;
    }

    if (active !== null) {
      active.target.removeEventListener(
        active.type,
        active.listener,
        active.capture,
      );
      subscriptionRef.current = null;
    }
    if (currentTarget === null) return;

    const listener: EventListener = (event) => {
      const currentHandler = handlerRef.current;
      currentHandler(event as EventMapFor<Target>[Type]);
    };
    const listenerOptions: AddEventListenerOptions = {
      capture,
      once,
      passive,
      ...(signal === undefined ? {} : { signal }),
    };

    currentTarget.addEventListener(type, listener, listenerOptions);
    subscriptionRef.current = {
      capture,
      listener,
      once,
      passive,
      signal,
      target: currentTarget,
      type,
    };
  });

  useEffect(
    () => () => {
      const active = subscriptionRef.current;
      if (active === null) return;
      active.target.removeEventListener(
        active.type,
        active.listener,
        active.capture,
      );
      subscriptionRef.current = null;
    },
    [],
  );
};
