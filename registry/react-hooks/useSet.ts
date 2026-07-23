import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type SetValues<Value> = ReadonlySet<Value> | readonly Value[];

export interface UseSetResult<Value> {
  readonly set: ReadonlySet<Value>;
  readonly add: (value: Value) => void;
  readonly addMany: (values: Iterable<Value>) => void;
  readonly remove: (value: Value) => void;
  readonly toggle: (value: Value) => void;
  readonly clear: () => void;
  readonly reset: () => void;
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function copyValues<Value>(values: SetValues<Value>): Set<Value> {
  if (Array.isArray(values)) {
    for (let index = 0; index < values.length; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(values, index)) {
        throw new TypeError("values must not be sparse");
      }
    }
  }

  return new Set(values);
}

export function useSet<Value>(
  initialValues: SetValues<Value> = [],
): UseSetResult<Value> {
  const resetSnapshot = copyValues(initialValues);
  const [set, setSet] = useState(() => resetSnapshot);
  const initialRef = useRef<ReadonlySet<Value>>(resetSnapshot);

  useIsomorphicLayoutEffect(() => {
    initialRef.current = resetSnapshot;
  });

  const add = useCallback((value: Value) => {
    setSet((current) => {
      if (current.has(value)) return current;
      const next = new Set(current);
      next.add(value);
      return next;
    });
  }, []);

  const addMany = useCallback((values: Iterable<Value>) => {
    const materialized = Array.isArray(values)
      ? Array.from(copyValues(values))
      : Array.from(values);
    if (materialized.length === 0) return;

    setSet((current) => {
      const next = new Set(current);
      for (const value of materialized) next.add(value);
      return next.size === current.size ? current : next;
    });
  }, []);

  const remove = useCallback((value: Value) => {
    setSet((current) => {
      if (!current.has(value)) return current;
      const next = new Set(current);
      next.delete(value);
      return next;
    });
  }, []);

  const toggle = useCallback((value: Value) => {
    setSet((current) => {
      const next = new Set(current);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSet((current) => (current.size === 0 ? current : new Set()));
  }, []);

  const reset = useCallback(() => {
    setSet(new Set(initialRef.current));
  }, []);

  return { set, add, addMany, remove, toggle, clear, reset };
}
