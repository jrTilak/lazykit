import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import type { RefCallback } from "react";

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  enabled?: boolean;
  freezeOnceVisible?: boolean;
  onChange?: (this: void, entry: IntersectionObserverEntry) => void;
}

export interface UseIntersectionObserverReturn<ElementType extends Element> {
  entry: IntersectionObserverEntry | null;
  isIntersecting: boolean;
  isSupported: boolean;
  ref: RefCallback<ElementType>;
}

interface ObservedNode<ElementType extends Element> {
  node: ElementType | null;
  version: number;
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Observes visibility for a callback-ref node and cleans up on node swaps. */
export const useIntersectionObserver = <
  ElementType extends Element = HTMLElement,
>(
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverReturn<ElementType> => {
  const {
    enabled = true,
    freezeOnceVisible = false,
    onChange,
    root = null,
    rootMargin = "0px",
    threshold = 0,
  } = options;
  const [observedNode, setObservedNode] = useState<
    ObservedNode<ElementType>
  >({ node: null, version: 0 });
  const { node, version: nodeVersion } = observedNode;
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const nodeRef = useRef<ElementType | null>(null);
  const nodeVersionRef = useRef(0);
  const callbackRef = useRef(onChange);
  useIsomorphicLayoutEffect(() => {
    callbackRef.current = onChange;
  }, [onChange]);
  const ref = useCallback<RefCallback<ElementType>>((nextNode) => {
    nodeRef.current = nextNode;
    nodeVersionRef.current += 1;
    setObservedNode({ node: nextNode, version: nodeVersionRef.current });
    setEntry(null);
  }, []);
  const isSupported =
    typeof window !== "undefined" &&
    typeof IntersectionObserver === "function";
  const thresholdKey = Array.isArray(threshold) ? threshold.join(",") : threshold;

  useEffect(() => {
    if (!enabled || !isSupported || node === null) return;
    let active = true;
    let frozen = false;
    const observer = new IntersectionObserver((entries) => {
      const nextEntry = entries[0];
      if (
        !active ||
        !nextEntry ||
        frozen ||
        nextEntry.target !== node ||
        nodeRef.current !== node ||
        nodeVersionRef.current !== nodeVersion
      ) {
        return;
      }
      setEntry(nextEntry);
      const currentCallback = callbackRef.current;
      currentCallback?.(nextEntry);
      if (freezeOnceVisible && nextEntry.isIntersecting) {
        frozen = true;
        observer.disconnect();
      }
    }, { root, rootMargin, threshold });
    observer.observe(node);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [
    enabled,
    freezeOnceVisible,
    isSupported,
    node,
    nodeVersion,
    root,
    rootMargin,
    thresholdKey,
  ]);

  return {
    entry,
    isIntersecting: entry?.isIntersecting ?? false,
    isSupported,
    ref,
  };
};
