import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type MapEntries<Key, Value> =
  | ReadonlyMap<Key, Value>
  | readonly (readonly [Key, Value])[];

export interface UseMapResult<Key, Value> {
  readonly map: ReadonlyMap<Key, Value>;
  readonly set: (key: Key, value: Value) => void;
  readonly setMany: (entries: Iterable<readonly [Key, Value]>) => void;
  readonly update: (
    key: Key,
    updater: (
      this: void,
      value: Value | undefined,
      exists: boolean,
    ) => Value,
  ) => void;
  readonly remove: (key: Key) => void;
  readonly clear: () => void;
  readonly reset: () => void;
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useMap<Key, Value>(
  initialEntries: MapEntries<Key, Value> = [],
): UseMapResult<Key, Value> {
  const resetSnapshot = new Map(initialEntries);
  const [map, setMap] = useState(() => resetSnapshot);
  const initialRef = useRef<ReadonlyMap<Key, Value>>(resetSnapshot);

  useIsomorphicLayoutEffect(() => {
    initialRef.current = resetSnapshot;
  });

  const set = useCallback((key: Key, value: Value) => {
    setMap((current) => {
      if (current.has(key) && Object.is(current.get(key), value)) return current;
      const next = new Map(current);
      next.set(key, value);
      return next;
    });
  }, []);

  const setMany = useCallback(
    (entries: Iterable<readonly [Key, Value]>) => {
      const materialized = Array.from(entries);
      if (materialized.length === 0) return;

      setMap((current) => {
        const next = new Map(current);
        for (const [key, value] of materialized) {
          next.set(key, value);
        }

        for (const [key] of materialized) {
          if (
            current.has(key) !== next.has(key) ||
            !Object.is(current.get(key), next.get(key))
          ) {
            return next;
          }
        }
        return current;
      });
    },
    [],
  );

  const update = useCallback(
    (
      key: Key,
      updater: (
        this: void,
        value: Value | undefined,
        exists: boolean,
      ) => Value,
    ) => {
      setMap((current) => {
        const exists = current.has(key);
        const value = updater(current.get(key), exists);
        if (exists && Object.is(current.get(key), value)) {
          return current;
        }
        const next = new Map(current);
        next.set(key, value);
        return next;
      });
    },
    [],
  );

  const remove = useCallback((key: Key) => {
    setMap((current) => {
      if (!current.has(key)) return current;
      const next = new Map(current);
      next.delete(key);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setMap((current) => (current.size === 0 ? current : new Map()));
  }, []);

  const reset = useCallback(() => {
    setMap(new Map(initialRef.current));
  }, []);

  return { map, set, setMany, update, remove, clear, reset };
}
