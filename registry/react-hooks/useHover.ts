import { useCallback, useEffect, useState } from "react";

import type { RefCallback } from "react";

export interface UseHoverReturn<ElementType extends Element> {
  isHovered: boolean;
  ref: RefCallback<ElementType>;
}

/** Tracks pointer hover for a node assigned through the returned callback ref. */
export const useHover = <ElementType extends Element = HTMLElement>(
  enabled: boolean = true,
): UseHoverReturn<ElementType> => {
  const [node, setNode] = useState<ElementType | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useCallback<RefCallback<ElementType>>((nextNode) => {
    setNode(nextNode);
    setIsHovered(false);
  }, []);

  useEffect(() => {
    if (!enabled || node === null) {
      setIsHovered(false);
      return;
    }
    const enter = () => setIsHovered(true);
    const leave = () => setIsHovered(false);
    node.addEventListener("pointerenter", enter);
    node.addEventListener("pointerleave", leave);
    return () => {
      node.removeEventListener("pointerenter", enter);
      node.removeEventListener("pointerleave", leave);
    };
  }, [enabled, node]);

  return { isHovered, ref };
};
