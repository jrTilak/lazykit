import { useCallback, useEffect, useRef, useState } from "react";

import type { RefCallback } from "react";

export interface ElementSize {
  height: number;
  width: number;
}

export interface UseElementSizeOptions {
  box?: ResizeObserverBoxOptions;
}

export interface UseElementSizeReturn<ElementType extends Element>
  extends ElementSize {
  isSupported: boolean;
  ref: RefCallback<ElementType>;
}

const emptyElementSize: ElementSize = { height: 0, width: 0 };

interface ObservedNode<ElementType extends Element> {
  node: ElementType | null;
  version: number;
}

/** Measures a node with ResizeObserver and follows callback-ref node swaps. */
export const useElementSize = <ElementType extends Element = HTMLElement>(
  options: UseElementSizeOptions = {},
): UseElementSizeReturn<ElementType> => {
  const { box = "content-box" } = options;
  const [observedNode, setObservedNode] = useState<
    ObservedNode<ElementType>
  >({ node: null, version: 0 });
  const { node, version: nodeVersion } = observedNode;
  const [size, setSize] = useState<ElementSize>(emptyElementSize);
  const nodeRef = useRef<ElementType | null>(null);
  const nodeVersionRef = useRef(0);
  const isSupported =
    typeof window !== "undefined" && typeof ResizeObserver === "function";
  const ref = useCallback<RefCallback<ElementType>>((nextNode) => {
    nodeRef.current = nextNode;
    nodeVersionRef.current += 1;
    setObservedNode({ node: nextNode, version: nodeVersionRef.current });
    setSize(emptyElementSize);
  }, []);

  useEffect(() => {
    if (node === null) return;
    const update = (width: number, height: number) => {
      if (
        nodeRef.current !== node ||
        nodeVersionRef.current !== nodeVersion
      ) {
        return;
      }
      setSize((current) =>
        current.width === width && current.height === height
          ? current
          : { height, width },
      );
    };

    if (!isSupported) {
      const rect = node.getBoundingClientRect();
      update(rect.width, rect.height);
      return;
    }
    let active = true;
    const observer = new ResizeObserver((entries) => {
      if (!active) return;
      const entry = entries[0];
      if (!entry) return;
      const observedSize =
        box === "border-box"
          ? entry.borderBoxSize?.[0]
          : box === "device-pixel-content-box"
            ? entry.devicePixelContentBoxSize?.[0]
            : entry.contentBoxSize?.[0];
      if (observedSize) {
        update(observedSize.inlineSize, observedSize.blockSize);
      } else {
        update(entry.contentRect.width, entry.contentRect.height);
      }
    });
    observer.observe(node, { box });
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [box, isSupported, node, nodeVersion]);

  return { ...size, isSupported, ref };
};
