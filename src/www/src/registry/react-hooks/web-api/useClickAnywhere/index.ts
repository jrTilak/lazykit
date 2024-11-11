import React, { useEffect, useState } from "react";

export type UseClickAnywhereReturn = {
  enable: () => void;
  disable: () => void;
  isEnabled: boolean;
};

/**
 * listens for clicks outside specified elements and triggers a callback, with options to enable/disable the listener and handle multiple refs to ignore.
 */
const useClickAnywhere = (
  callback: (event: MouseEvent) => void,
  autoEnable: boolean = true,
  ignoreRefs: React.RefObject<HTMLElement>[] = []
): UseClickAnywhereReturn => {
  const [enabled, setEnabled] = useState(autoEnable);

  useEffect(() => {
    // Function to handle the click event
    const handleClick = (event: MouseEvent) => {
      // Check if the click is inside any of the ignored elements (refs)
      const isInsideIgnoredElement = ignoreRefs.some((ref) =>
        ref.current ? ref.current.contains(event.target as Node) : false
      );

      if (isInsideIgnoredElement || !enabled) return;

      // Trigger the callback when clicking outside the ignored areas
      callback(event);
    };

    if (enabled) {
      // Attach the event listener to the document
      document.addEventListener("click", handleClick);
    }

    // Cleanup: Remove the event listener when the component is unmounted or dependencies change
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [callback, enabled]);

  // Functions to enable and disable the event listener
  const enable = () => setEnabled(true);
  const disable = () => setEnabled(false);

  return { enable, disable, isEnabled: enabled };
};

export default useClickAnywhere;
