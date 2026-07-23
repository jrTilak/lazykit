import { useCallback, useEffect, useState } from "react";

import type { RefCallback } from "react";

export interface UseFocusWithinReturn<ElementType extends HTMLElement> {
  isFocusWithin: boolean;
  ref: RefCallback<ElementType>;
}

/** Tracks whether focus is on an element or one of its descendants. */
export const useFocusWithin = <
  ElementType extends HTMLElement = HTMLElement,
>(
  enabled: boolean = true,
): UseFocusWithinReturn<ElementType> => {
  const [node, setNode] = useState<ElementType | null>(null);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const ref = useCallback<RefCallback<ElementType>>((nextNode) => {
    setNode(nextNode);
    setIsFocusWithin(false);
  }, []);

  useEffect(() => {
    if (!enabled || node === null) {
      setIsFocusWithin(false);
      return;
    }
    setIsFocusWithin(node.contains(node.ownerDocument.activeElement));
    const focusIn = () => setIsFocusWithin(true);
    const focusOut = (event: FocusEvent) => {
      if (!(event.relatedTarget instanceof Node) || !node.contains(event.relatedTarget)) {
        setIsFocusWithin(false);
      }
    };
    node.addEventListener("focusin", focusIn);
    node.addEventListener("focusout", focusOut);
    return () => {
      node.removeEventListener("focusin", focusIn);
      node.removeEventListener("focusout", focusOut);
    };
  }, [enabled, node]);

  return { isFocusWithin, ref };
};
