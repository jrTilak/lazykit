import React, { useState, useEffect } from "react";

interface UseInnerSizeReturn {
  width: number;
  height: number;
}

/**
 * tracks the size of a referenced element or the window and returns its width and height, updating on window resize.
 */
const useInnerSize = (
  ref?: React.RefObject<HTMLElement>
): UseInnerSizeReturn => {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateSize = () => {
      if (ref && ref.current) {
        // Track the element's size if ref is provided
        setSize({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      } else {
        // Track the window size if ref is not provided
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    // Initial size update
    updateSize();

    // Listen for window resize events
    const handleResize = () => {
      updateSize();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]); // Re-run effect if ref changes

  return size;
};

export default useInnerSize;
