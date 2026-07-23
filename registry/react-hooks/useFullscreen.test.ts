import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "bun:test";
import { createElement, StrictMode } from "react";

import { useFullscreen } from "./useFullscreen";

import type { PropsWithChildren, ReactElement } from "react";

const strictWrapper = ({ children }: PropsWithChildren): ReactElement =>
  createElement(StrictMode, null, children);

const fullscreenDescriptor = Object.getOwnPropertyDescriptor(
  document,
  "fullscreenElement",
);
const exitFullscreenDescriptor = Object.getOwnPropertyDescriptor(
  document,
  "exitFullscreen",
);
const rootRequestFullscreenDescriptor = Object.getOwnPropertyDescriptor(
  document.documentElement,
  "requestFullscreen",
);

afterEach(() => {
  if (fullscreenDescriptor) {
    Object.defineProperty(document, "fullscreenElement", fullscreenDescriptor);
  } else {
    Reflect.deleteProperty(document, "fullscreenElement");
  }
  if (exitFullscreenDescriptor) {
    Object.defineProperty(
      document,
      "exitFullscreen",
      exitFullscreenDescriptor,
    );
  } else {
    Reflect.deleteProperty(document, "exitFullscreen");
  }
  if (rootRequestFullscreenDescriptor) {
    Object.defineProperty(
      document.documentElement,
      "requestFullscreen",
      rootRequestFullscreenDescriptor,
    );
  } else {
    Reflect.deleteProperty(document.documentElement, "requestFullscreen");
  }
});

describe("useFullscreen", () => {
  it("enters, exits, follows the event state, and handles rejection", async () => {
    const element = document.createElement("div");
    let fullscreenElement: Element | null = null;
    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      get: () => fullscreenElement,
    });
    element.requestFullscreen = vi.fn(async () => {
      fullscreenElement = element;
      document.dispatchEvent(new Event("fullscreenchange"));
    });
    document.exitFullscreen = vi.fn(async () => {
      fullscreenElement = null;
      document.dispatchEvent(new Event("fullscreenchange"));
    });
    document.documentElement.requestFullscreen = vi.fn(async () => {});
    const ref = { current: element };
    const { result, unmount } = renderHook(() => useFullscreen(ref));
    expect(result.current.isSupported).toBe(true);
    await act(async () => {
      expect(await result.current.enter()).toBe(true);
    });
    expect(result.current.isFullscreen).toBe(true);
    await act(async () => {
      expect(await result.current.toggle()).toBe(true);
    });
    expect(result.current.isFullscreen).toBe(false);

    element.requestFullscreen = vi.fn(async () => {
      throw new Error("denied");
    });
    await act(async () => {
      expect(await result.current.enter()).toBe(false);
    });
    expect(result.current.error?.message).toBe("denied");
    unmount();
  });

  it("never falls back to the document root for a supplied empty ref", async () => {
    const rootRequest = vi.fn(async () => {});
    document.documentElement.requestFullscreen = rootRequest;
    document.exitFullscreen = vi.fn(async () => {});
    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      value: document.documentElement,
    });
    const ref: { current: HTMLDivElement | null } = { current: null };
    const { result } = renderHook(() => useFullscreen(ref));

    expect(result.current.isFullscreen).toBe(false);
    await act(async () => {
      expect(await result.current.enter()).toBe(false);
    });
    expect(rootRequest).not.toHaveBeenCalled();
  });

  it("does not update state when enter and exit reject after unmount", async () => {
    document.documentElement.requestFullscreen = vi.fn(async () => {});
    let fullscreenElement: Element | null = null;
    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      get: () => fullscreenElement,
    });

    let rejectEnter: (reason: Error) => void = () => {};
    const element = document.createElement("div");
    element.requestFullscreen = vi.fn(
      () =>
        new Promise<void>((_resolve, reject) => {
          rejectEnter = reject;
        }),
    );
    document.exitFullscreen = vi.fn(async () => {});
    const enterHook = renderHook(() =>
      useFullscreen({ current: element }),
    );
    let enterPromise!: Promise<boolean>;
    act(() => {
      enterPromise = enterHook.result.current.enter();
    });
    enterHook.unmount();
    rejectEnter(new Error("late enter rejection"));
    expect(await enterPromise).toBe(false);

    fullscreenElement = element;
    let rejectExit: (reason: Error) => void = () => {};
    document.exitFullscreen = vi.fn(
      () =>
        new Promise<void>((_resolve, reject) => {
          rejectExit = reject;
        }),
    );
    const exitHook = renderHook(() =>
      useFullscreen({ current: element }),
    );
    let exitPromise!: Promise<boolean>;
    act(() => {
      exitPromise = exitHook.result.current.exit();
    });
    exitHook.unmount();
    rejectExit(new Error("late exit rejection"));
    expect(await exitPromise).toBe(false);
  });

  it("only records element-targeted errors for the matching hook", () => {
    document.documentElement.requestFullscreen = vi.fn(async () => {});
    document.exitFullscreen = vi.fn(async () => {});
    const first = document.createElement("div");
    const second = document.createElement("div");
    first.requestFullscreen = vi.fn(async () => {});
    second.requestFullscreen = vi.fn(async () => {});
    document.body.append(first, second);
    const firstHook = renderHook(() =>
      useFullscreen({ current: first }),
    );
    const secondHook = renderHook(() =>
      useFullscreen({ current: second }),
    );

    act(() =>
      first.dispatchEvent(
        new Event("fullscreenerror", { bubbles: true }),
      ),
    );
    expect(firstHook.result.current.error?.message).toBe(
      "The fullscreen request failed",
    );
    expect(secondHook.result.current.error).toBeNull();
    const firstError = firstHook.result.current.error;

    act(() =>
      second.dispatchEvent(
        new Event("fullscreenerror", { bubbles: true }),
      ),
    );
    expect(firstHook.result.current.error).toBe(firstError);
    expect(secondHook.result.current.error?.message).toBe(
      "The fullscreen request failed",
    );

    firstHook.unmount();
    secondHook.unmount();
    first.remove();
    second.remove();
  });

  it("uses the latest committed ref target through StrictMode replay", async () => {
    document.documentElement.requestFullscreen = vi.fn(async () => {});
    document.exitFullscreen = vi.fn(async () => {});
    const first = document.createElement("div");
    const second = document.createElement("div");
    first.requestFullscreen = vi.fn(async () => {});
    second.requestFullscreen = vi.fn(async () => {});
    const ref: { current: HTMLDivElement | null } = { current: first };
    const { result, rerender } = renderHook(() => useFullscreen(ref), {
      wrapper: strictWrapper,
    });

    ref.current = second;
    rerender();
    await act(async () => {
      expect(await result.current.toggle()).toBe(true);
    });
    expect(first.requestFullscreen).not.toHaveBeenCalled();
    expect(second.requestFullscreen).toHaveBeenCalledTimes(1);
  });
});
