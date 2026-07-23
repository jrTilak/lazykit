import { useEffect, useLayoutEffect, useRef } from "react";

export type Hotkey = string;

export interface UseHotkeyOptions {
  enabled?: boolean;
  exactModifiers?: boolean;
  ignoreEditable?: boolean;
  preventDefault?: boolean;
  repeat?: boolean;
  target?: EventTarget | null;
}

interface ParsedHotkey {
  alt: boolean;
  ctrl: boolean;
  key: string;
  meta: boolean;
  mod: boolean;
  shift: boolean;
}

type Modifier = "alt" | "ctrl" | "meta" | "mod" | "shift";

const modifierAliases: Readonly<Record<string, Modifier>> = {
  alt: "alt",
  cmd: "meta",
  command: "meta",
  control: "ctrl",
  ctrl: "ctrl",
  meta: "meta",
  mod: "mod",
  option: "alt",
  shift: "shift",
};

const useSafeLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const isEditableTarget = (target: EventTarget | null): boolean =>
  typeof HTMLElement === "function" &&
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement);

const invalidHotkey = (hotkey: string, reason: string): never => {
  throw new TypeError(`Invalid hotkey "${hotkey}": ${reason}`);
};

const parseHotkey = (hotkey: string): ParsedHotkey => {
  const rawParts = hotkey.split("+");
  if (rawParts.some((part) => part.trim().length === 0)) {
    return invalidHotkey(
      hotkey,
      'empty chord segments are not allowed; use "plus" for the + key',
    );
  }

  const parts = rawParts.map((part) => part.trim().toLowerCase());
  const modifiers = new Set<Modifier>();
  const keys: string[] = [];
  for (const part of parts) {
    const modifier = modifierAliases[part];
    if (modifier === undefined) {
      keys.push(part);
      continue;
    }
    if (modifiers.has(modifier)) {
      return invalidHotkey(hotkey, `modifier "${modifier}" is duplicated`);
    }
    modifiers.add(modifier);
  }
  if (keys.length === 0) {
    return invalidHotkey(hotkey, "a non-modifier key is required");
  }
  if (keys.length > 1) {
    return invalidHotkey(hotkey, "only one non-modifier key is allowed");
  }
  if (
    modifiers.has("mod") &&
    (modifiers.has("ctrl") || modifiers.has("meta"))
  ) {
    return invalidHotkey(
      hotkey,
      '"mod" cannot be combined with "ctrl" or "meta"',
    );
  }

  return {
    alt: modifiers.has("alt"),
    ctrl: modifiers.has("ctrl"),
    key: keys[0] === "plus" ? "+" : keys[0]!,
    meta: modifiers.has("meta"),
    mod: modifiers.has("mod"),
    shift: modifiers.has("shift"),
  };
};

const matchesHotkey = (
  event: KeyboardEvent,
  hotkey: ParsedHotkey,
  exactModifiers: boolean,
): boolean => {
  const modMatches = !hotkey.mod || event.ctrlKey || event.metaKey;
  const modifiersMatch =
    modMatches &&
    (!hotkey.alt || event.altKey) &&
    (!hotkey.ctrl || event.ctrlKey) &&
    (!hotkey.meta || event.metaKey) &&
    (!hotkey.shift || event.shiftKey);
  if (!modifiersMatch) return false;

  if (exactModifiers) {
    if (event.altKey !== hotkey.alt || event.shiftKey !== hotkey.shift) {
      return false;
    }
    if (hotkey.mod) {
      if (event.ctrlKey === event.metaKey) return false;
    } else if (
      event.ctrlKey !== hotkey.ctrl ||
      event.metaKey !== hotkey.meta
    ) {
      return false;
    }
  }

  const eventKey = event.key.toLowerCase();
  const eventCode = event.code.toLowerCase();
  return (
    eventKey === hotkey.key ||
    eventCode === hotkey.key ||
    eventCode === `key${hotkey.key}`
  );
};

/** Runs a callback for one or more keyboard shortcuts. */
export const useHotkey = (
  hotkeys: Hotkey | readonly Hotkey[],
  handler: (this: void, event: KeyboardEvent) => void,
  options: UseHotkeyOptions = {},
): void => {
  const parsedHotkeys = (
    typeof hotkeys === "string" ? [hotkeys] : hotkeys
  ).map(parseHotkey);
  const hotkeysRef = useRef(parsedHotkeys);
  const handlerRef = useRef(handler);
  useSafeLayoutEffect(() => {
    hotkeysRef.current = parsedHotkeys;
    handlerRef.current = handler;
  });

  const {
    enabled = true,
    exactModifiers = true,
    ignoreEditable = true,
    preventDefault = true,
    repeat = false,
    target = typeof window === "undefined" ? null : window,
  } = options;

  useEffect(() => {
    if (!enabled || target === null) return;

    const listener = (rawEvent: Event) => {
      if (
        typeof KeyboardEvent !== "function" ||
        !(rawEvent instanceof KeyboardEvent)
      ) {
        return;
      }
      const event = rawEvent;
      if (
        (!repeat && event.repeat) ||
        (ignoreEditable && isEditableTarget(event.target))
      ) {
        return;
      }
      if (
        !hotkeysRef.current.some((value) =>
          matchesHotkey(event, value, exactModifiers),
        )
      ) {
        return;
      }
      if (preventDefault) event.preventDefault();
      const currentHandler = handlerRef.current;
      currentHandler(event);
    };

    target.addEventListener("keydown", listener);
    return () => target.removeEventListener("keydown", listener);
  }, [enabled, exactModifiers, ignoreEditable, preventDefault, repeat, target]);
};
