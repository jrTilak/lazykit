import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type Callable = (...args: never[]) => unknown;

type NonCallable<Value> = Value extends Callable ? never : Value;

export type HistoryStateAction<Value> =
  | NonCallable<Value>
  | ((this: void, value: Value) => Value);

export interface UseHistoryStateOptions<Value> {
  readonly maxHistory?: number;
  readonly isEqual?: (
    this: void,
    left: Readonly<Value>,
    right: Readonly<Value>,
  ) => boolean;
}

export interface UseHistoryStateResult<Value> {
  readonly state: Value;
  readonly setState: (action: HistoryStateAction<Value>) => void;
  readonly undo: () => void;
  readonly redo: () => void;
  readonly reset: () => void;
  readonly clearHistory: () => void;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
}

interface History<Value> {
  readonly past: readonly Value[];
  readonly present: Value;
  readonly future: readonly Value[];
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function assertMaxHistory(maxHistory: number): void {
  if (!Number.isSafeInteger(maxHistory) || maxHistory < 0) {
    throw new RangeError("maxHistory must be a non-negative safe integer");
  }
}

export function useHistoryState<Value>(
  initialValue: Value,
  options: UseHistoryStateOptions<Value> = {},
): UseHistoryStateResult<Value> {
  const { maxHistory = 100, isEqual = Object.is } = options;
  assertMaxHistory(maxHistory);

  const [history, setHistory] = useState<History<Value>>(() => ({
    past: [],
    present: initialValue,
    future: [],
  }));
  const initialRef = useRef(initialValue);
  const maxHistoryRef = useRef(maxHistory);
  const isEqualRef = useRef(isEqual);

  useIsomorphicLayoutEffect(() => {
    initialRef.current = initialValue;
    maxHistoryRef.current = maxHistory;
    isEqualRef.current = isEqual;
  });

  useEffect(() => {
    setHistory((current) => {
      if (current.past.length <= maxHistory) return current;
      return {
        ...current,
        past: maxHistory === 0 ? [] : current.past.slice(-maxHistory),
      };
    });
  }, [maxHistory]);

  const setState = useCallback(
    (action: HistoryStateAction<Value>) => {
      setHistory((current) => {
        const next =
          typeof action === "function"
            ? (action as (this: void, value: Value) => Value)(
                current.present,
              )
            : action;
        const isEqual = isEqualRef.current;
        if (Reflect.apply(isEqual, undefined, [current.present, next])) {
          return current;
        }

        const limit = maxHistoryRef.current;
        const past =
          limit === 0
            ? []
            : [...current.past, current.present].slice(-limit);
        return { past, present: next, future: [] };
      });
    },
    [],
  );

  const undo = useCallback(() => {
    setHistory((current) => {
      const previous = current.past.at(-1);
      if (previous === undefined && current.past.length === 0) return current;
      return {
        past: current.past.slice(0, -1),
        present: previous as Value,
        future: [current.present, ...current.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((current) => {
      if (current.future.length === 0) return current;
      const [next, ...future] = current.future;
      const limit = maxHistoryRef.current;
      const past =
        limit === 0
          ? []
          : [...current.past, current.present].slice(-limit);
      return { past, present: next as Value, future };
    });
  }, []);

  const reset = useCallback(() => {
    setHistory({ past: [], present: initialRef.current, future: [] });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory((current) =>
      current.past.length === 0 && current.future.length === 0
        ? current
        : { past: [], present: current.present, future: [] },
    );
  }, []);

  return {
    state: history.present,
    setState,
    undo,
    redo,
    reset,
    clearHistory,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
