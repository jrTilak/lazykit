import { useEffect, useLayoutEffect, useRef } from "react";

export type UseDocumentTitleOptions = {
  restoreOnUnmount?: boolean;
};

type TitleEntry = {
  id: symbol;
  order: number;
  restoreOnUnmount: boolean;
  title: string;
};

type StickyTitleEntry = Omit<TitleEntry, "restoreOnUnmount">;

type TitleState = {
  baseTitle: string;
  entries: Map<symbol, TitleEntry>;
  nextOrder: number;
  stickyEntries: StickyTitleEntry[];
};

const titleStates = new WeakMap<Document, TitleState>();

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const getTitleState = (ownerDocument: Document): TitleState => {
  const existing = titleStates.get(ownerDocument);
  if (existing !== undefined) return existing;

  const created: TitleState = {
    baseTitle: ownerDocument.title,
    entries: new Map(),
    nextOrder: 0,
    stickyEntries: [],
  };
  titleStates.set(ownerDocument, created);
  return created;
};

const getLatestTitle = (state: TitleState): string => {
  let latestOrder = -1;
  let latestTitle = state.baseTitle;

  for (const entry of state.stickyEntries) {
    if (entry.order > latestOrder) {
      latestOrder = entry.order;
      latestTitle = entry.title;
    }
  }

  for (const entry of state.entries.values()) {
    if (entry.order > latestOrder) {
      latestOrder = entry.order;
      latestTitle = entry.title;
    }
  }

  return latestTitle;
};

const removeTitle = (
  ownerDocument: Document,
  id: symbol,
  retain: boolean,
): void => {
  const state = titleStates.get(ownerDocument);
  const entry = state?.entries.get(id);
  if (state === undefined || entry === undefined) return;

  state.entries.delete(id);
  if (retain && !entry.restoreOnUnmount) {
    state.stickyEntries.push({
      id,
      order: entry.order,
      title: entry.title,
    });
  }

  ownerDocument.title = getLatestTitle(state);
  if (state.entries.size === 0) {
    titleStates.delete(ownerDocument);
  }
};

const updateTitle = (
  ownerDocument: Document,
  id: symbol,
  title: string,
  restoreOnUnmount: boolean,
): void => {
  const state = getTitleState(ownerDocument);
  const existing = state.entries.get(id);

  // React Strict Mode replays effects. Reclaim the temporary sticky entry
  // produced by that cleanup before registering the owner again.
  state.stickyEntries = state.stickyEntries.filter((entry) => entry.id !== id);

  if (existing === undefined || existing.title !== title) {
    state.nextOrder += 1;
    state.entries.set(id, {
      id,
      order: state.nextOrder,
      restoreOnUnmount,
      title,
    });
  } else {
    existing.restoreOnUnmount = restoreOnUnmount;
  }

  ownerDocument.title = getLatestTitle(state);
};

/**
 * Coordinates document.title updates across every mounted hook instance.
 */
export const useDocumentTitle = (
  title: string | null,
  options: UseDocumentTitleOptions = {},
): void => {
  const restoreOnUnmount = options.restoreOnUnmount ?? true;
  const idRef = useRef(Symbol("useDocumentTitle"));

  useIsomorphicLayoutEffect(() => {
    if (typeof document === "undefined") return;

    if (title === null) {
      removeTitle(document, idRef.current, false);
    } else {
      updateTitle(document, idRef.current, title, restoreOnUnmount);
    }
  }, [restoreOnUnmount, title]);

  useIsomorphicLayoutEffect(
    () => () => {
      if (typeof document !== "undefined") {
        removeTitle(document, idRef.current, true);
      }
    },
    [],
  );
};
