import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import type { Ref, RefCallback } from "react";

export type MergeableRef<Value> = Ref<Value> | null | undefined;

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function assignRef<Value>(ref: Ref<Value>, value: Value | null): void {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  (ref as { current: Value | null }).current = value;
}

export function useMergedRefs<Value>(
  ...refs: readonly MergeableRef<Value>[]
): RefCallback<Value> {
  const refsRef = useRef(refs);
  const valueRef = useRef<Value | null>(null);
  const hasAssignedRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const previousRefs = refsRef.current;
    refsRef.current = refs;

    if (!hasAssignedRef.current) return;

    for (const ref of previousRefs) {
      if (
        ref !== null &&
        ref !== undefined &&
        !refs.includes(ref)
      ) {
        assignRef(ref, null);
      }
    }

    for (const ref of refs) {
      if (
        ref !== null &&
        ref !== undefined &&
        !previousRefs.includes(ref)
      ) {
        assignRef(ref, valueRef.current);
      }
    }
  });

  return useCallback((value: Value | null) => {
    valueRef.current = value;
    hasAssignedRef.current = true;
    for (const ref of refsRef.current) {
        if (ref !== null && ref !== undefined) assignRef(ref, value);
    }
  }, []);
}
