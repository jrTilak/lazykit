import { useEffect, useLayoutEffect, useRef } from "react";

import type { RefObject } from "react";

export interface UseScrollLockOptions {
  enabled?: boolean;
  preserveScrollbarGap?: boolean;
}

interface LockState {
  computedPaddingRight: number;
  originalOverflow: string;
  originalPaddingRight: string;
  owners: Map<object, boolean>;
}

const locks = new WeakMap<HTMLElement, LockState>();
const useSafeLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const applyLock = (target: HTMLElement, state: LockState): void => {
  target.style.overflow = "hidden";
  if (typeof document === "undefined" || target !== document.body) return;

  const shouldPreserveGap = [...state.owners.values()].some(Boolean);
  const gap =
    shouldPreserveGap && typeof window !== "undefined"
      ? Math.max(
          0,
          window.innerWidth - document.documentElement.clientWidth,
        )
      : 0;
  target.style.paddingRight =
    gap > 0
      ? `${state.computedPaddingRight + gap}px`
      : state.originalPaddingRight;
};

const acquireLock = (
  target: HTMLElement,
  owner: object,
  preserveScrollbarGap: boolean,
): void => {
  let state = locks.get(target);
  if (state === undefined) {
    state = {
      computedPaddingRight:
        Number.parseFloat(getComputedStyle(target).paddingRight) || 0,
      originalOverflow: target.style.overflow,
      originalPaddingRight: target.style.paddingRight,
      owners: new Map(),
    };
    locks.set(target, state);
  }
  state.owners.set(owner, preserveScrollbarGap);
  applyLock(target, state);
};

const releaseLock = (target: HTMLElement, owner: object): void => {
  const state = locks.get(target);
  if (state === undefined || !state.owners.delete(owner)) return;
  if (state.owners.size > 0) {
    applyLock(target, state);
    return;
  }
  target.style.overflow = state.originalOverflow;
  target.style.paddingRight = state.originalPaddingRight;
  locks.delete(target);
};

/** Locks scrolling on the document body or a supplied element. */
export const useScrollLock = <ElementType extends HTMLElement = HTMLElement>(
  ref?: RefObject<ElementType | null>,
  options: UseScrollLockOptions = {},
): void => {
  const { enabled = true, preserveScrollbarGap = true } = options;
  const ownerRef = useRef<object>({});
  const activeTargetRef = useRef<HTMLElement | null>(null);

  // Reconcile after every commit so stable RefObjects can move without
  // releasing and reacquiring unchanged locks on ordinary rerenders.
  useSafeLayoutEffect(() => {
    const nextTarget =
      !enabled || typeof document === "undefined"
        ? null
        : ref === undefined
          ? document.body
          : ref.current;
    const activeTarget = activeTargetRef.current;
    if (activeTarget !== nextTarget && activeTarget !== null) {
      releaseLock(activeTarget, ownerRef.current);
    }
    activeTargetRef.current = nextTarget;
    if (nextTarget !== null) {
      acquireLock(nextTarget, ownerRef.current, preserveScrollbarGap);
    }
  });

  useSafeLayoutEffect(
    () => () => {
      const activeTarget = activeTargetRef.current;
      if (activeTarget === null) return;
      releaseLock(activeTarget, ownerRef.current);
      activeTargetRef.current = null;
    },
    [],
  );
};
