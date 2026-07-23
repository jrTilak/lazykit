import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import type { RefCallback } from "react";

export interface UseMutationObserverOptions extends MutationObserverInit {
  enabled?: boolean;
}

export interface UseMutationObserverReturn<ElementType extends Node> {
  isSupported: boolean;
  ref: RefCallback<ElementType>;
}

interface ObservedNode<ElementType extends Node> {
  node: ElementType | null;
  version: number;
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Observes mutations for a callback-ref node with the latest callback. */
export const useMutationObserver = <ElementType extends Node = HTMLElement>(
  callback: MutationCallback,
  options: UseMutationObserverOptions = { childList: true },
): UseMutationObserverReturn<ElementType> => {
  const {
    enabled = true,
    attributeFilter,
    attributeOldValue,
    attributes,
    characterData,
    characterDataOldValue,
    childList,
    subtree,
  } = options;
  const [observedNode, setObservedNode] = useState<
    ObservedNode<ElementType>
  >({ node: null, version: 0 });
  const { node, version: nodeVersion } = observedNode;
  const nodeRef = useRef<ElementType | null>(null);
  const nodeVersionRef = useRef(0);
  const callbackRef = useRef(callback);
  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  const ref = useCallback<RefCallback<ElementType>>((nextNode) => {
    nodeRef.current = nextNode;
    nodeVersionRef.current += 1;
    setObservedNode({ node: nextNode, version: nodeVersionRef.current });
  }, []);
  const isSupported =
    typeof window !== "undefined" && typeof MutationObserver === "function";
  const attributeFilterKey = attributeFilter?.join("\u0000");
  const effectiveAttributes =
    attributes ?? (attributeFilter !== undefined || attributeOldValue === true);
  const effectiveCharacterData =
    characterData ?? characterDataOldValue === true;
  const effectiveChildList =
    childList ?? (!effectiveAttributes && !effectiveCharacterData);
  if (
    attributes === false &&
    (attributeFilter !== undefined || attributeOldValue === true)
  ) {
    throw new TypeError(
      "attributes cannot be false when attributeFilter or attributeOldValue is enabled",
    );
  }
  if (characterData === false && characterDataOldValue === true) {
    throw new TypeError(
      "characterData cannot be false when characterDataOldValue is enabled",
    );
  }
  if (!effectiveAttributes && !effectiveCharacterData && !effectiveChildList) {
    throw new TypeError("At least one mutation observation mode must be enabled");
  }

  useEffect(() => {
    if (!enabled || !isSupported || node === null) return;
    let active = true;
    const observer = new MutationObserver((records, currentObserver) => {
      if (
        !active ||
        nodeRef.current !== node ||
        nodeVersionRef.current !== nodeVersion
      ) {
        return;
      }
      Reflect.apply(callbackRef.current, undefined, [
        records,
        currentObserver,
      ]);
    });
    observer.observe(node, {
      ...(attributeFilter === undefined ? {} : { attributeFilter }),
      ...(attributeOldValue === undefined ? {} : { attributeOldValue }),
      attributes: effectiveAttributes,
      characterData: effectiveCharacterData,
      ...(characterDataOldValue === undefined ? {} : { characterDataOldValue }),
      childList: effectiveChildList,
      ...(subtree === undefined ? {} : { subtree }),
    });
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [
    attributeFilterKey,
    attributeOldValue,
    effectiveAttributes,
    effectiveCharacterData,
    characterDataOldValue,
    effectiveChildList,
    enabled,
    isSupported,
    node,
    nodeVersion,
    subtree,
  ]);

  return { isSupported, ref };
};
