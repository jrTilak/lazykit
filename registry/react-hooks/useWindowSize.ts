import { useSyncExternalStore } from "react";

export interface WindowSize {
  height: number;
  width: number;
}

const serverWindowSize: WindowSize = { height: 0, width: 0 };
let cachedWindowSize: WindowSize = serverWindowSize;

const getWindowSize = (): WindowSize => {
  if (typeof window === "undefined") return serverWindowSize;
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (cachedWindowSize.width !== width || cachedWindowSize.height !== height) {
    cachedWindowSize = { height, width };
  }
  return cachedWindowSize;
};

const subscribeToWindowSize = (notify: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("resize", notify);
  window.addEventListener("orientationchange", notify);
  return () => {
    window.removeEventListener("resize", notify);
    window.removeEventListener("orientationchange", notify);
  };
};

/** Returns a concurrent-safe snapshot of the viewport dimensions. */
export const useWindowSize = (): WindowSize =>
  useSyncExternalStore(subscribeToWindowSize, getWindowSize, () => serverWindowSize);
