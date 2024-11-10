import React, { useEffect, useState, useRef } from "react";

export interface UseObserveConfig {
  once?: boolean; // Trigger callback only once
  autoEnable?: boolean; // Whether to enable the observer immediately (default: true)
  threshold?: number | number[]; // Intersection threshold(s)
  root?: HTMLElement | null; // The root element for the intersection observer
  rootMargin?: string; // Margin around the root
  onIntersect?: () => void; // Callback when the element intersects
  onLeave?: () => void; // Callback when the element leaves the viewport
}

export interface UseObserveReturn {
  position: DOMRect | null; // The position of the element
  isIntersecting: boolean; // Whether the element is currently intersecting the viewport
  enable: () => void; // Enable the observer
  disable: () => void; // Disable the observer
  isEnabled: boolean;
}

const useObserve = (
  ref: React.RefObject<HTMLElement>,
  config: UseObserveConfig = {}
): UseObserveReturn => {
  const {
    once = false,
    autoEnable = true,
    threshold = 0,
    root = null,
    rootMargin = "0px",
    onIntersect = () => {},
    onLeave = () => {},
  } = config;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [position, setPosition] = useState<DOMRect | null>(null);
  const [enabled, setEnabled] = useState(autoEnable);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const previousIsIntersectingRef = useRef<boolean>(false); // Track previous intersection state

  const enable = () => setEnabled(true);
  const disable = () => setEnabled(false);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setPosition(entry.boundingClientRect);

          const currentIsIntersecting = entry.isIntersecting;

          if (currentIsIntersecting !== previousIsIntersectingRef.current) {
            setIsIntersecting(currentIsIntersecting);

            if (currentIsIntersecting) {
              onIntersect();
              if (once) observer.disconnect();
            } else {
              onLeave();
            }

            previousIsIntersectingRef.current = currentIsIntersecting; // Update the previous state
          }
        });
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    observer.observe(ref.current);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [ref, enabled, once, root, rootMargin, threshold, onIntersect, onLeave]);

  return { position, isIntersecting, enable, disable, isEnabled: enabled };
};

export default useObserve;
