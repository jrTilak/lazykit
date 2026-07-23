import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import type { RefObject } from "react";

export interface UseFullscreenReturn {
  enter: () => Promise<boolean>;
  error: Error | null;
  exit: () => Promise<boolean>;
  isFullscreen: boolean;
  isSupported: boolean;
  toggle: () => Promise<boolean>;
}

const subscribeToFullscreen = (notify: () => void): (() => void) => {
  if (typeof document === "undefined") return () => {};
  document.addEventListener("fullscreenchange", notify);
  return () => document.removeEventListener("fullscreenchange", notify);
};

const getFullscreenElement = (): Element | null =>
  typeof document === "undefined" ? null : document.fullscreenElement;

const useSafeLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Controls standards-based fullscreen mode for a ref or the document root. */
export const useFullscreen = <ElementType extends Element = HTMLElement>(
  ref?: RefObject<ElementType | null>,
): UseFullscreenReturn => {
  const fullscreenElement = useSyncExternalStore(
    subscribeToFullscreen,
    getFullscreenElement,
    () => null,
  );
  const [error, setError] = useState<Error | null>(null);
  const targetRef = useRef<Element | null>(null);
  const mountedRef = useRef(false);
  const fullscreenRef = useRef(false);
  const target =
    typeof document === "undefined"
      ? null
      : ref === undefined
        ? document.documentElement
        : ref.current;
  const isFullscreen =
    fullscreenElement !== null && fullscreenElement === target;

  useSafeLayoutEffect(() => {
    targetRef.current =
      typeof document === "undefined"
        ? null
        : ref === undefined
          ? document.documentElement
          : ref.current;
    fullscreenRef.current =
      fullscreenElement !== null &&
      fullscreenElement === targetRef.current;
  });
  useSafeLayoutEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const isSupported =
    typeof document !== "undefined" &&
    typeof document.documentElement.requestFullscreen === "function" &&
    typeof document.exitFullscreen === "function";

  useEffect(() => {
    if (typeof document === "undefined") return;
    const onError = (event: Event) => {
      const eventTarget = event.target;
      if (
        typeof Element === "function" &&
        eventTarget instanceof Element &&
        eventTarget !== targetRef.current
      ) {
        return;
      }
      if (mountedRef.current) {
        setError(new Error("The fullscreen request failed"));
      }
    };
    document.addEventListener("fullscreenerror", onError, true);
    return () => document.removeEventListener("fullscreenerror", onError, true);
  }, []);

  const enter = useCallback(async (): Promise<boolean> => {
    const element = targetRef.current;
    if (
      element === null ||
      typeof element.requestFullscreen !== "function" ||
      typeof document.exitFullscreen !== "function"
    ) {
      return false;
    }
    try {
      if (mountedRef.current) setError(null);
      await element.requestFullscreen();
      return true;
    } catch (cause) {
      if (mountedRef.current) {
        setError(cause instanceof Error ? cause : new Error(String(cause)));
      }
      return false;
    }
  }, []);
  const exit = useCallback(async (): Promise<boolean> => {
    if (
      typeof document === "undefined" ||
      typeof document.exitFullscreen !== "function" ||
      document.fullscreenElement === null
    ) {
      return false;
    }
    try {
      if (mountedRef.current) setError(null);
      await document.exitFullscreen();
      return true;
    } catch (cause) {
      if (mountedRef.current) {
        setError(cause instanceof Error ? cause : new Error(String(cause)));
      }
      return false;
    }
  }, []);
  const toggle = useCallback(
    (): Promise<boolean> => (fullscreenRef.current ? exit() : enter()),
    [enter, exit],
  );

  return { enter, error, exit, isFullscreen, isSupported, toggle };
};
