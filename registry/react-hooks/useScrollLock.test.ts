import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "bun:test";
import { createElement, StrictMode } from "react";

import { useScrollLock } from "./useScrollLock";

import type { PropsWithChildren, ReactElement } from "react";

const strictWrapper = ({ children }: PropsWithChildren): ReactElement =>
  createElement(StrictMode, null, children);
const bodyStyle = document.body.style.cssText;
const innerWidthDescriptor = Object.getOwnPropertyDescriptor(
  window,
  "innerWidth",
);
const clientWidthDescriptor = Object.getOwnPropertyDescriptor(
  document.documentElement,
  "clientWidth",
);

const setViewportGap = (gap: number): void => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: 1000,
  });
  Object.defineProperty(document.documentElement, "clientWidth", {
    configurable: true,
    value: 1000 - gap,
  });
};

afterEach(() => {
  document.body.style.cssText = bodyStyle;
  if (innerWidthDescriptor === undefined) {
    Reflect.deleteProperty(window, "innerWidth");
  } else {
    Object.defineProperty(window, "innerWidth", innerWidthDescriptor);
  }
  if (clientWidthDescriptor === undefined) {
    Reflect.deleteProperty(document.documentElement, "clientWidth");
  } else {
    Object.defineProperty(
      document.documentElement,
      "clientWidth",
      clientWidthDescriptor,
    );
  }
});

describe("useScrollLock", () => {
  it("reference-counts body locks and restores original styles", () => {
    document.body.style.overflow = "auto";
    const first = renderHook(() =>
      useScrollLock(undefined, { preserveScrollbarGap: false }),
    );
    const second = renderHook(() =>
      useScrollLock(undefined, { preserveScrollbarGap: false }),
    );
    expect(document.body.style.overflow).toBe("hidden");
    first.unmount();
    expect(document.body.style.overflow).toBe("hidden");
    second.unmount();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("does not fall back to body for an empty supplied ref and follows a node swap", () => {
    document.body.style.overflow = "visible";
    const ref: { current: HTMLDivElement | null } = { current: null };
    const { rerender, unmount } = renderHook(() => useScrollLock(ref));
    expect(document.body.style.overflow).toBe("visible");
    const element = document.createElement("div");
    element.style.overflow = "scroll";
    ref.current = element;
    act(() => rerender());
    expect(element.style.overflow).toBe("hidden");
    unmount();
    expect(element.style.overflow).toBe("scroll");
  });

  it("combines mixed gap preferences independently of mount and unmount order", () => {
    setViewportGap(20);
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "4px";

    const withoutGap = renderHook(() =>
      useScrollLock(undefined, { preserveScrollbarGap: false }),
    );
    expect(document.body.style.paddingRight).toBe("4px");
    const withGap = renderHook(() =>
      useScrollLock(undefined, { preserveScrollbarGap: true }),
    );
    expect(document.body.style.paddingRight).toBe("24px");

    withoutGap.unmount();
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.paddingRight).toBe("24px");
    withGap.unmount();
    expect(document.body.style.overflow).toBe("auto");
    expect(document.body.style.paddingRight).toBe("4px");

    const gapFirst = renderHook(() =>
      useScrollLock(undefined, { preserveScrollbarGap: true }),
    );
    const gapSecond = renderHook(() =>
      useScrollLock(undefined, { preserveScrollbarGap: false }),
    );
    expect(document.body.style.paddingRight).toBe("24px");
    gapFirst.unmount();
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.paddingRight).toBe("4px");
    gapSecond.unmount();
    expect(document.body.style.overflow).toBe("auto");
    expect(document.body.style.paddingRight).toBe("4px");
  });

  it("updates gap ownership without accumulating padding", () => {
    setViewportGap(18);
    document.body.style.paddingRight = "2.5px";
    const { rerender, unmount } = renderHook(
      ({ preserve, render }) => {
        void render;
        useScrollLock(undefined, { preserveScrollbarGap: preserve });
      },
      { initialProps: { preserve: true, render: 0 } },
    );

    expect(document.body.style.paddingRight).toBe("20.5px");
    rerender({ preserve: true, render: 1 });
    expect(document.body.style.paddingRight).toBe("20.5px");
    rerender({ preserve: false, render: 2 });
    expect(document.body.style.paddingRight).toBe("2.5px");
    rerender({ preserve: true, render: 3 });
    expect(document.body.style.paddingRight).toBe("20.5px");
    unmount();
    expect(document.body.style.paddingRight).toBe("2.5px");
  });

  it("restores swapped targets and never redirects an explicit null ref", () => {
    document.body.style.overflow = "visible";
    const first = document.createElement("div");
    const second = document.createElement("div");
    first.style.overflow = "auto";
    second.style.overflow = "scroll";
    const ref: { current: HTMLDivElement | null } = { current: first };
    const { rerender, unmount } = renderHook(() => useScrollLock(ref));

    expect(first.style.overflow).toBe("hidden");
    ref.current = second;
    rerender();
    expect(first.style.overflow).toBe("auto");
    expect(second.style.overflow).toBe("hidden");
    ref.current = null;
    rerender();
    expect(second.style.overflow).toBe("scroll");
    expect(document.body.style.overflow).toBe("visible");
    unmount();
  });

  it("is idempotent through StrictMode setup replay and rerenders", () => {
    setViewportGap(12);
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "3px";
    const { rerender, unmount } = renderHook(
      ({ marker }) => {
        void marker;
        useScrollLock();
      },
      { initialProps: { marker: 0 }, wrapper: strictWrapper },
    );

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.paddingRight).toBe("15px");
    rerender({ marker: 1 });
    expect(document.body.style.paddingRight).toBe("15px");
    unmount();
    expect(document.body.style.overflow).toBe("auto");
    expect(document.body.style.paddingRight).toBe("3px");
  });
});
