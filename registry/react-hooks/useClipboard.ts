import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type ClipboardState =
  | {
      status: "idle";
      text: undefined;
      error: undefined;
    }
  | {
      status: "success";
      text: string;
      error: undefined;
    }
  | {
      status: "error";
      text: undefined;
      error: unknown;
    };

export type UseClipboardOptions = {
  resetAfterMs?: number | null;
};

export type UseClipboardReturn = {
  state: ClipboardState;
  isSupported: boolean;
  copy: (this: void, text: string) => Promise<void>;
  reset: () => void;
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const idleClipboardState = (): ClipboardState => ({
  status: "idle",
  text: undefined,
  error: undefined,
});

/** Copies text with the Clipboard API and tracks the latest request. */
export const useClipboard = (
  options: UseClipboardOptions = {},
): UseClipboardReturn => {
  const resetAfterMs = options.resetAfterMs ?? 2_000;
  if (
    resetAfterMs !== null &&
    (!Number.isFinite(resetAfterMs) || resetAfterMs < 0)
  ) {
    throw new RangeError(
      "resetAfterMs must be null or a finite, non-negative number",
    );
  }

  const [state, setState] = useState<ClipboardState>(idleClipboardState);
  const [isSupported, setIsSupported] = useState(false);
  const mountedRef = useRef(false);
  const requestIdRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current !== undefined) {
      clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = undefined;
  }, []);

  useIsomorphicLayoutEffect(() => {
    mountedRef.current = true;
    try {
      setIsSupported(
        typeof navigator !== "undefined" &&
          typeof navigator.clipboard?.writeText === "function",
      );
    } catch {
      setIsSupported(false);
    }

    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
      clearResetTimer();
    };
  }, [clearResetTimer]);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    clearResetTimer();
    if (mountedRef.current) setState(idleClipboardState);
  }, [clearResetTimer]);

  const copy = useCallback(
    async (text: string): Promise<void> => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      clearResetTimer();

      try {
        if (typeof navigator === "undefined") {
          throw new Error("Clipboard API is not available");
        }

        const clipboard = navigator.clipboard;
        const writeText = clipboard?.writeText;
        if (typeof writeText !== "function") {
          throw new Error("Clipboard API is not available");
        }

        await Reflect.apply(writeText, clipboard, [text]);

        if (mountedRef.current && requestIdRef.current === requestId) {
          setState({ status: "success", text, error: undefined });

          if (resetAfterMs !== null) {
            resetTimerRef.current = setTimeout(() => {
              resetTimerRef.current = undefined;
              if (
                mountedRef.current &&
                requestIdRef.current === requestId
              ) {
                setState(idleClipboardState);
              }
            }, resetAfterMs);
          }
        }
      } catch (error) {
        if (mountedRef.current && requestIdRef.current === requestId) {
          setState({ status: "error", text: undefined, error });
        }
        throw error;
      }
    },
    [clearResetTimer, resetAfterMs],
  );

  return { state, isSupported, copy, reset };
};
