import { useEffect, useLayoutEffect, useRef } from "react";

export type BeforeUnloadPredicate = (this: void) => boolean;

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Requests the browser's standard leave-page confirmation when enabled.
 */
export const useBeforeUnload = (
  shouldBlock: boolean | BeforeUnloadPredicate = true,
): void => {
  const shouldBlockRef = useRef(shouldBlock);
  const shouldSubscribe = typeof shouldBlock === "function" || shouldBlock;

  useIsomorphicLayoutEffect(() => {
    shouldBlockRef.current = shouldBlock;
  }, [shouldBlock]);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined" || !shouldSubscribe) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const block =
        typeof shouldBlockRef.current === "function"
          ? Reflect.apply(shouldBlockRef.current, undefined, [])
          : shouldBlockRef.current;
      if (!block) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldSubscribe]);
};
