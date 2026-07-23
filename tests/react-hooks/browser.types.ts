import { useClickOutside } from "../../registry/react-hooks/useClickOutside";
import { useDocumentVisibility } from "../../registry/react-hooks/useDocumentVisibility";
import { useElementSize } from "../../registry/react-hooks/useElementSize";
import { useEventListener } from "../../registry/react-hooks/useEventListener";
import { useFocusWithin } from "../../registry/react-hooks/useFocusWithin";
import { useFullscreen } from "../../registry/react-hooks/useFullscreen";
import { useHotkey } from "../../registry/react-hooks/useHotkey";
import { useHover } from "../../registry/react-hooks/useHover";
import { useIntersectionObserver } from "../../registry/react-hooks/useIntersectionObserver";
import { useLongPress } from "../../registry/react-hooks/useLongPress";
import { useMediaQuery } from "../../registry/react-hooks/useMediaQuery";
import { useMutationObserver } from "../../registry/react-hooks/useMutationObserver";
import { useOnlineStatus } from "../../registry/react-hooks/useOnlineStatus";
import { useScrollLock } from "../../registry/react-hooks/useScrollLock";
import { useWindowScroll } from "../../registry/react-hooks/useWindowScroll";
import { useWindowSize } from "../../registry/react-hooks/useWindowSize";

import type { RefCallback, RefObject } from "react";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends
  (<Value>() => Value extends Right ? 1 : 2)
    ? true
    : false;
type Expect<Value extends true> = Value;

declare const divRef: RefObject<HTMLDivElement>;
declare const svgRef: RefObject<SVGSVGElement>;
declare const mediaQueryList: MediaQueryList;
declare const receiverfulKeyboardHandler: (
  this: { source: string },
  event: KeyboardEvent,
) => void;
declare const receiverfulOutsideHandler: (
  this: { source: string },
  event: MouseEvent | PointerEvent | TouchEvent,
) => void;
declare const receiverfulIntersectionHandler: (
  this: { source: string },
  entry: IntersectionObserverEntry,
) => void;
declare const receiverfulVoidHandler: (this: { source: string }) => void;

useEventListener(window, "keydown", (event) => {
  type _Event = Expect<Equal<typeof event, KeyboardEvent>>;
});
// @ts-expect-error Window has no click-specific MouseEvent named "not-an-event".
useEventListener(window, "not-an-event", () => {});
// @ts-expect-error A keydown handler receives KeyboardEvent, not MouseEvent.
useEventListener(window, "keydown", (_event: MouseEvent) => {});
useEventListener(document.createElementNS("http://www.w3.org/2000/svg", "svg"), "click", (event) => {
  // TypeScript 6's current SVG event map models click as PointerEvent.
  type _Event = Expect<Equal<typeof event, PointerEvent>>;
});
useEventListener(mediaQueryList, "change", (event) => {
  type _Event = Expect<Equal<typeof event, MediaQueryListEvent>>;
});
// @ts-expect-error MediaQueryList only exposes its change event.
useEventListener(mediaQueryList, "keydown", () => {});
// @ts-expect-error Event handlers cannot require a receiver.
useEventListener(window, "keydown", receiverfulKeyboardHandler);

useClickOutside(divRef, (event) => {
  type _Event = Expect<Equal<typeof event, PointerEvent>>;
});
useClickOutside(divRef, (event) => {
  type _Event = Expect<Equal<typeof event, MouseEvent>>;
}, {
  eventType: "click",
});
useClickOutside(divRef, (event) => {
  type _Event = Expect<Equal<typeof event, TouchEvent>>;
}, {
  eventType: "touchstart",
});
// @ts-expect-error A click listener receives MouseEvent, not TouchEvent.
useClickOutside(divRef, (_event: TouchEvent) => {}, { eventType: "click" });
// @ts-expect-error Outside handlers cannot require a receiver.
useClickOutside(divRef, receiverfulOutsideHandler);
useHotkey(["mod+s", "escape"] as const, (event) => {
  type _Event = Expect<Equal<typeof event, KeyboardEvent>>;
});
// @ts-expect-error Hotkey handlers cannot require a receiver.
useHotkey("escape", receiverfulKeyboardHandler);

const hover = useHover<HTMLButtonElement>();
const _hoverRef: RefCallback<HTMLButtonElement> = hover.ref;
const focusWithin = useFocusWithin<HTMLFormElement>();
const _focusRef: RefCallback<HTMLFormElement> = focusWithin.ref;
const longPress = useLongPress<HTMLButtonElement>(() => {});
const _pointerDown = longPress.onPointerDown;
// @ts-expect-error Long-press handlers cannot require a receiver.
useLongPress(receiverfulVoidHandler);
// @ts-expect-error Long-press lifecycle callbacks cannot require a receiver.
useLongPress(() => {}, { onStart: receiverfulVoidHandler });

const windowSize = useWindowSize();
const _windowWidth: number = windowSize.width;
const elementSize = useElementSize<SVGSVGElement>();
const _elementRef: RefCallback<SVGSVGElement> = elementSize.ref;
const intersection = useIntersectionObserver<HTMLElement>();
const _intersectionRef: RefCallback<HTMLElement> = intersection.ref;
// @ts-expect-error Intersection callbacks cannot require a receiver.
useIntersectionObserver({ onChange: receiverfulIntersectionHandler });
const mutation = useMutationObserver<HTMLElement>(() => {});
const _mutationRef: RefCallback<HTMLElement> = mutation.ref;

const scroll = useWindowScroll();
scroll.scrollTo(0, 10);
scroll.scrollTo({ top: 10, behavior: "smooth" });
const _online: boolean = useOnlineStatus();
const _matches: boolean = useMediaQuery("(prefers-reduced-motion: reduce)");
const _visibility: DocumentVisibilityState = useDocumentVisibility();
const fullscreen = useFullscreen(divRef);
const _enterResult: Promise<boolean> = fullscreen.enter();
const svgFullscreen = useFullscreen(svgRef);
const _svgEnterResult: Promise<boolean> = svgFullscreen.enter();
useScrollLock(divRef, { enabled: true });
