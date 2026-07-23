import { useCallback, useMemo, useSyncExternalStore } from "react";

export interface WindowScrollPosition {
  x: number;
  y: number;
}

export interface UseWindowScrollReturn extends WindowScrollPosition {
  scrollTo: {
    (options: ScrollToOptions): void;
    (x: number, y: number): void;
  };
}

const serverScrollPosition: WindowScrollPosition = { x: 0, y: 0 };
let cachedScrollPosition: WindowScrollPosition = serverScrollPosition;

const getScrollPosition = (): WindowScrollPosition => {
  if (typeof window === "undefined") return serverScrollPosition;
  const x = window.scrollX;
  const y = window.scrollY;
  if (cachedScrollPosition.x !== x || cachedScrollPosition.y !== y) {
    cachedScrollPosition = { x, y };
  }
  return cachedScrollPosition;
};

const subscribeToScroll = (notify: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("scroll", notify, { passive: true });
  return () => window.removeEventListener("scroll", notify);
};

/** Returns the current window scroll position and a typed scrollTo control. */
export const useWindowScroll = (): UseWindowScrollReturn => {
  const position = useSyncExternalStore(
    subscribeToScroll,
    getScrollPosition,
    () => serverScrollPosition,
  );
  const scrollTo = useCallback(
    ((first: number | ScrollToOptions, second?: number) => {
      if (typeof window === "undefined") return;
      if (typeof first === "number") window.scrollTo(first, second ?? 0);
      else window.scrollTo(first);
    }) as UseWindowScrollReturn["scrollTo"],
    [],
  );
  return useMemo(() => ({ ...position, scrollTo }), [position, scrollTo]);
};
