import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type ListStateAction<Item> =
  | readonly Item[]
  | ((this: void, items: readonly Item[]) => readonly Item[]);

export type ListItemUpdater<Item> = (
  this: void,
  item: Item,
  index: number,
  items: readonly Item[],
) => Item;

export type ListPredicate<Item> = (
  this: void,
  item: Item,
  index: number,
  items: readonly Item[],
) => boolean;

export interface UseListResult<Item> {
  readonly items: readonly Item[];
  readonly setItems: (action: ListStateAction<Item>) => void;
  readonly append: (...items: readonly Item[]) => void;
  readonly prepend: (...items: readonly Item[]) => void;
  readonly insertAt: (index: number, ...items: readonly Item[]) => void;
  readonly setAt: (index: number, item: Item) => void;
  readonly updateAt: (index: number, updater: ListItemUpdater<Item>) => void;
  readonly move: (fromIndex: number, toIndex: number) => void;
  readonly removeAt: (index: number) => void;
  readonly removeWhere: (predicate: ListPredicate<Item>) => void;
  readonly clear: () => void;
  readonly reset: () => void;
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function copyDense<Item>(items: readonly Item[]): Item[] {
  if (!Array.isArray(items)) throw new TypeError("items must be an array");

  for (let index = 0; index < items.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(items, index)) {
      throw new TypeError("items must not be sparse");
    }
  }

  return Array.from(items);
}

function isIndex(index: number, length: number, allowEnd = false): boolean {
  return (
    Number.isSafeInteger(index) &&
    index >= 0 &&
    index < length + (allowEnd ? 1 : 0)
  );
}

export function useList<Item>(
  initialItems: readonly Item[] = [],
): UseListResult<Item> {
  const resetSnapshot = copyDense(initialItems);
  const [items, setInternalItems] = useState(() => resetSnapshot);
  const initialRef = useRef<readonly Item[]>(resetSnapshot);

  useIsomorphicLayoutEffect(() => {
    initialRef.current = resetSnapshot;
  });

  const setItems = useCallback((action: ListStateAction<Item>) => {
    setInternalItems((current) => {
      const next =
        typeof action === "function" ? action(current) : action;
      if (next === current) return current;
      return copyDense(next);
    });
  }, []);

  const append = useCallback((...added: readonly Item[]) => {
    if (added.length > 0) setInternalItems((current) => [...current, ...added]);
  }, []);

  const prepend = useCallback((...added: readonly Item[]) => {
    if (added.length > 0) setInternalItems((current) => [...added, ...current]);
  }, []);

  const insertAt = useCallback(
    (index: number, ...inserted: readonly Item[]) => {
      if (inserted.length === 0) return;
      setInternalItems((current) =>
        isIndex(index, current.length, true)
          ? [...current.slice(0, index), ...inserted, ...current.slice(index)]
          : current,
      );
    },
    [],
  );

  const setAt = useCallback((index: number, item: Item) => {
    setInternalItems((current) => {
      if (!isIndex(index, current.length) || Object.is(current[index], item)) {
        return current;
      }
      const next = [...current];
      next[index] = item;
      return next;
    });
  }, []);

  const updateAt = useCallback(
    (index: number, updater: ListItemUpdater<Item>) => {
      setInternalItems((current) => {
        if (!isIndex(index, current.length)) return current;
        const nextItem = updater(current[index] as Item, index, current);
        if (Object.is(current[index], nextItem)) return current;
        const next = [...current];
        next[index] = nextItem;
        return next;
      });
    },
    [],
  );

  const move = useCallback((fromIndex: number, toIndex: number) => {
    setInternalItems((current) => {
      if (
        !isIndex(fromIndex, current.length) ||
        !isIndex(toIndex, current.length) ||
        fromIndex === toIndex
      ) {
        return current;
      }

      const next = [...current];
      const removed = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, ...removed);
      return next;
    });
  }, []);

  const removeAt = useCallback((index: number) => {
    setInternalItems((current) =>
      isIndex(index, current.length)
        ? [...current.slice(0, index), ...current.slice(index + 1)]
        : current,
    );
  }, []);

  const removeWhere = useCallback((predicate: ListPredicate<Item>) => {
    setInternalItems((current) => {
      const next = current.filter(
        (item, index) => !predicate(item, index, current),
      );
      return next.length === current.length ? current : next;
    });
  }, []);

  const clear = useCallback(() => {
    setInternalItems((current) => (current.length === 0 ? current : []));
  }, []);

  const reset = useCallback(() => {
    setInternalItems(copyDense(initialRef.current));
  }, []);

  return {
    items,
    setItems,
    append,
    prepend,
    insertAt,
    setAt,
    updateAt,
    move,
    removeAt,
    removeWhere,
    clear,
    reset,
  };
}
