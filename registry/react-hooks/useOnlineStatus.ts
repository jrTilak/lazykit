import { useSyncExternalStore } from "react";

const subscribeToOnlineStatus = (notify: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("online", notify);
  window.addEventListener("offline", notify);
  return () => {
    window.removeEventListener("online", notify);
    window.removeEventListener("offline", notify);
  };
};

const getOnlineStatus = (): boolean =>
  typeof navigator === "undefined" ? true : navigator.onLine;

/** Tracks browser online/offline events with an SSR-safe snapshot. */
export const useOnlineStatus = (): boolean =>
  useSyncExternalStore(subscribeToOnlineStatus, getOnlineStatus, () => true);
