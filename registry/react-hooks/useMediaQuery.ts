import { useCallback, useMemo, useSyncExternalStore } from "react";

export interface UseMediaQueryOptions {
  defaultValue?: boolean;
}

/** Subscribes to a CSS media query with a hydration-safe server fallback. */
export const useMediaQuery = (
  query: string,
  options: UseMediaQueryOptions = {},
): boolean => {
  const { defaultValue = false } = options;
  const list = useMemo(
    () =>
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
        ? null
        : window.matchMedia(query),
    [query],
  );
  const subscribe = useCallback(
    (notify: () => void) => {
      if (list === null) return () => {};
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    [list],
  );
  const getSnapshot = useCallback(() => list?.matches ?? defaultValue, [
    defaultValue,
    list,
  ]);
  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
