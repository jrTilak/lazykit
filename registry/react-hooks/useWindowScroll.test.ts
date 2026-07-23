import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "bun:test";

import { useWindowScroll } from "./useWindowScroll";

const scrollToDescriptor = Object.getOwnPropertyDescriptor(window, "scrollTo");
const scrollXDescriptor = Object.getOwnPropertyDescriptor(window, "scrollX");
const scrollYDescriptor = Object.getOwnPropertyDescriptor(window, "scrollY");

afterEach(() => {
  if (scrollToDescriptor) {
    Object.defineProperty(window, "scrollTo", scrollToDescriptor);
  } else {
    Reflect.deleteProperty(window, "scrollTo");
  }
  if (scrollXDescriptor) Object.defineProperty(window, "scrollX", scrollXDescriptor);
  else Reflect.deleteProperty(window, "scrollX");
  if (scrollYDescriptor) Object.defineProperty(window, "scrollY", scrollYDescriptor);
  else Reflect.deleteProperty(window, "scrollY");
});

describe("useWindowScroll", () => {
  it("tracks scroll events and supports both scrollTo signatures", () => {
    let x = 0;
    let y = 0;
    Object.defineProperty(window, "scrollX", { configurable: true, get: () => x });
    Object.defineProperty(window, "scrollY", { configurable: true, get: () => y });
    window.scrollTo = vi.fn((first: number | ScrollToOptions, second?: number) => {
      if (typeof first === "number") {
        x = first;
        y = second ?? 0;
      } else {
        x = first.left ?? x;
        y = first.top ?? y;
      }
    }) as typeof window.scrollTo;
    const { result } = renderHook(() => useWindowScroll());
    expect({ x: result.current.x, y: result.current.y }).toEqual({ x: 0, y: 0 });
    x = 12;
    y = 34;
    act(() => window.dispatchEvent(new Event("scroll")));
    expect({ x: result.current.x, y: result.current.y }).toEqual({ x: 12, y: 34 });
    result.current.scrollTo(5, 9);
    expect(window.scrollTo).toHaveBeenCalledWith(5, 9);
    result.current.scrollTo({ top: 20 });
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 20 });
  });
});
