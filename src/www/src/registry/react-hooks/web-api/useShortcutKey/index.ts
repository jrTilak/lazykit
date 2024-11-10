import React, { useState, useEffect, useCallback } from "react";

export type ShortcutKeyCallback = (
  ref: React.RefObject<HTMLElement>,
  event: KeyboardEvent
) => void;

export interface UseShortcutKeyConfig {
  keys: string | string[]; // Can be a single key, array of keys
  preventDefault?: boolean; // Whether to prevent the default action for the key combination
  callback?: ShortcutKeyCallback; // Callback triggered when the key combination is pressed
  autoEnable?: boolean; // Whether to enable the shortcut listening by default (default: true)
}

/**
 * triggers a callback or click on specified keyboard shortcuts, with options to enable/disable and prevent default actions.
 */
const useShortcutKey = (
  ref: React.RefObject<HTMLElement>,
  config: UseShortcutKeyConfig
) => {
  const { keys, preventDefault = true, callback, autoEnable = true } = config;

  const [isEnabled, setIsEnabled] = useState(autoEnable); // Track whether the listener is enabled

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!ref.current) return;

      const keyCombinations = Array.isArray(keys) ? keys : [keys];

      keyCombinations.forEach((keyCombo) => {
        const keysArray = Array.isArray(keyCombo)
          ? keyCombo
          : keyCombo.split("+");

        const isMatch = keysArray.every((key) => {
          if (key === "Control") return event.ctrlKey;
          if (key === "Shift") return event.shiftKey;
          if (key === "Alt") return event.altKey;
          return event.key === key || event.code === key;
        });

        if (isMatch) {
          if (preventDefault) event.preventDefault();
          if (callback) {
            callback(ref, event);
          } else {
            ref.current?.click();
          }
        }
      });
    },
    [ref, keys, callback, preventDefault]
  );

  useEffect(() => {
    if (!isEnabled) return;

    const handler = (event: KeyboardEvent) => handleKeyDown(event);

    // Add the event listener if enabled
    window.addEventListener("keydown", handler);

    // Cleanup the event listener when the component unmounts or dependencies change
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [handleKeyDown, isEnabled]);

  // Functions to enable and disable the event listener
  const enable = () => setIsEnabled(true);
  const disable = () => setIsEnabled(false);

  return { enable, disable, isEnabled };
};

export default useShortcutKey;
