import { useEffect, useLayoutEffect, useRef } from "react";

import type { RefObject } from "react";

export interface ClickOutsideEventMap {
  click: MouseEvent;
  mousedown: MouseEvent;
  pointerdown: PointerEvent;
  touchstart: TouchEvent;
}

export type ClickOutsideEvent =
  ClickOutsideEventMap[keyof ClickOutsideEventMap];

export type ClickOutsideEventType = keyof ClickOutsideEventMap;

export interface UseClickOutsideOptions<
  EventType extends ClickOutsideEventType = "pointerdown",
> {
  capture?: boolean;
  enabled?: boolean;
  eventType?: EventType;
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Calls a handler when an event occurs outside every supplied element. */
export const useClickOutside = <
  ElementType extends Element,
  EventType extends ClickOutsideEventType = "pointerdown",
>(
  refs:
    | RefObject<ElementType | null>
    | readonly RefObject<ElementType | null>[],
  handler: (
    this: void,
    event: ClickOutsideEventMap[EventType],
  ) => void,
  options: UseClickOutsideOptions<EventType> = {},
): void => {
  const refsRef = useRef(refs);
  const handlerRef = useRef(handler);
  useIsomorphicLayoutEffect(() => {
    refsRef.current = refs;
    handlerRef.current = handler;
  }, [handler, refs]);

  const {
    capture = true,
    enabled = true,
    eventType = "pointerdown",
  } = options;

  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;

    const listener = (event: Event) => {
      const currentRefs: readonly RefObject<ElementType | null>[] =
        Array.isArray(refsRef.current)
          ? refsRef.current
          : [refsRef.current as RefObject<ElementType | null>];
      const elements = currentRefs
        .map((ref) => ref.current)
        .filter((element): element is ElementType => element !== null);
      if (elements.length === 0) return;

      const path = event
        .composedPath()
        .filter((item): item is EventTarget => item !== undefined);
      const target = event.target;
      const isInside = elements.some(
        (element) =>
          path.includes(element) ||
          (target instanceof Node && element.contains(target)),
      );

      if (!isInside) {
        const currentHandler = handlerRef.current;
        currentHandler(event as ClickOutsideEventMap[EventType]);
      }
    };

    document.addEventListener(eventType, listener, capture);
    return () => document.removeEventListener(eventType, listener, capture);
  }, [capture, enabled, eventType]);
};
