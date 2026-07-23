import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import type { PointerEventHandler } from "react";

export interface UseLongPressOptions {
  delayMs?: number;
  disabled?: boolean;
  movementThreshold?: number;
  onCancel?: (this: void) => void;
  onFinish?: (this: void) => void;
  onStart?: (this: void) => void;
}

export interface LongPressHandlers<ElementType extends HTMLElement> {
  onPointerCancel: PointerEventHandler<ElementType>;
  onPointerDown: PointerEventHandler<ElementType>;
  onPointerLeave: PointerEventHandler<ElementType>;
  onPointerMove: PointerEventHandler<ElementType>;
  onPointerUp: PointerEventHandler<ElementType>;
}

interface ActiveLongPress {
  pointerId: number;
  startX: number;
  startY: number;
  timer?: ReturnType<typeof setTimeout>;
  triggered: boolean;
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Returns pointer handlers that recognize a press held for a configured delay. */
export const useLongPress = <ElementType extends HTMLElement = HTMLElement>(
  handler: (this: void) => void,
  options: UseLongPressOptions = {},
): LongPressHandlers<ElementType> => {
  const {
    delayMs = 500,
    disabled = false,
    movementThreshold = 10,
    onCancel,
    onFinish,
    onStart,
  } = options;
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new RangeError("delayMs must be a finite, non-negative number");
  }
  if (!Number.isFinite(movementThreshold) || movementThreshold < 0) {
    throw new RangeError("movementThreshold must be a finite, non-negative number");
  }

  const callbacksRef = useRef({ handler, onCancel, onFinish, onStart });
  useIsomorphicLayoutEffect(() => {
    callbacksRef.current = { handler, onCancel, onFinish, onStart };
  }, [handler, onCancel, onFinish, onStart]);
  const stateRef = useRef<ActiveLongPress | null>(null);

  const cancel = useCallback((finished: boolean) => {
    const state = stateRef.current;
    if (state === null) return;
    if (state.timer !== undefined) clearTimeout(state.timer);
    stateRef.current = null;
    const { onCancel: currentOnCancel, onFinish: currentOnFinish } =
      callbacksRef.current;
    if (state.triggered && finished) currentOnFinish?.();
    else if (!state.triggered) currentOnCancel?.();
  }, []);

  useEffect(
    () => () => cancel(false),
    [cancel, delayMs, disabled, movementThreshold],
  );
  useEffect(() => {
    if (disabled) cancel(false);
  }, [cancel, disabled]);

  const onPointerDown = useCallback<PointerEventHandler<ElementType>>(
    (event) => {
      if (disabled || event.button !== 0) return;
      cancel(false);
      const currentOnStart = callbacksRef.current.onStart;
      currentOnStart?.();
      const state: ActiveLongPress = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        triggered: false,
      };
      state.timer = setTimeout(() => {
        state.triggered = true;
        const currentHandler = callbacksRef.current.handler;
        currentHandler();
      }, delayMs);
      stateRef.current = state;
    },
    [cancel, delayMs, disabled],
  );
  const onPointerMove = useCallback<PointerEventHandler<ElementType>>(
    (event) => {
      const state = stateRef.current;
      if (state === null || event.pointerId !== state.pointerId) return;
      if (
        Math.hypot(event.clientX - state.startX, event.clientY - state.startY) >
        movementThreshold
      ) {
        cancel(false);
      }
    },
    [cancel, movementThreshold],
  );
  const onPointerUp = useCallback<PointerEventHandler<ElementType>>(
    (event) => {
      if (stateRef.current?.pointerId === event.pointerId) cancel(true);
    },
    [cancel],
  );
  const onPointerCancel = useCallback<PointerEventHandler<ElementType>>(
    (event) => {
      if (stateRef.current?.pointerId === event.pointerId) cancel(false);
    },
    [cancel],
  );

  return {
    onPointerCancel,
    onPointerDown,
    onPointerLeave: onPointerCancel,
    onPointerMove,
    onPointerUp,
  };
};
