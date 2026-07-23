import { useSyncExternalStore } from "react";

const subscribeToVisibility = (notify: () => void): (() => void) => {
  if (typeof document === "undefined") return () => {};
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
};

const getVisibility = (): DocumentVisibilityState =>
  typeof document === "undefined" ? "hidden" : document.visibilityState;

/** Returns the current document visibility state. */
export const useDocumentVisibility = (): DocumentVisibilityState =>
  useSyncExternalStore(subscribeToVisibility, getVisibility, () => "hidden");
