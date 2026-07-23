import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "bun:test";

import { useElementSize } from "./useElementSize";

const resizeObserverDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "ResizeObserver",
);
const instances: ResizeObserverMock[] = [];

class ResizeObserverMock {
  readonly disconnect = vi.fn();
  readonly observe = vi.fn();
  readonly unobserve = vi.fn();

  constructor(readonly callback: ResizeObserverCallback) {
    instances.push(this);
  }

  emit(width: number, height: number): void {
    const entry = {
      contentRect: { width, height },
    } as ResizeObserverEntry;
    this.callback([entry], this as unknown as ResizeObserver);
  }
}

afterEach(() => {
  if (resizeObserverDescriptor === undefined) {
    Reflect.deleteProperty(globalThis, "ResizeObserver");
  } else {
    Object.defineProperty(
      globalThis,
      "ResizeObserver",
      resizeObserverDescriptor,
    );
  }
  instances.length = 0;
});

describe("useElementSize", () => {
  it("measures entries and reconnects when its callback-ref node changes", () => {
    globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
    const first = document.createElement("div");
    const second = document.createElement("div");
    const { result, unmount } = renderHook(() =>
      useElementSize<HTMLDivElement>({ box: "border-box" }),
    );

    act(() => result.current.ref(first));
    expect(instances[0]?.observe).toHaveBeenCalledWith(first, { box: "border-box" });
    act(() => instances[0]?.emit(120, 40));
    expect(result.current.width).toBe(120);
    expect(result.current.height).toBe(40);

    act(() => result.current.ref(second));
    act(() => instances[0]?.emit(900, 900));
    expect(result.current.width).toBe(0);
    expect(result.current.height).toBe(0);
    expect(instances[0]?.disconnect).toHaveBeenCalledTimes(1);
    expect(instances[1]?.observe).toHaveBeenCalledWith(second, { box: "border-box" });

    const secondObserver = instances[1];
    act(() => {
      result.current.ref(null);
      result.current.ref(second);
      secondObserver?.emit(800, 800);
    });
    expect(result.current.width).toBe(0);
    expect(result.current.height).toBe(0);
    expect(instances[2]?.observe).toHaveBeenCalledWith(second, {
      box: "border-box",
    });
    act(() => instances[2]?.emit(60, 30));
    expect(result.current.width).toBe(60);
    expect(result.current.height).toBe(30);

    unmount();
    expect(instances[2]?.disconnect).toHaveBeenCalledTimes(1);
  });

  it("falls back to a one-time measurement when ResizeObserver is unavailable", () => {
    globalThis.ResizeObserver =
      undefined as unknown as typeof ResizeObserver;
    const node = document.createElement("div");
    node.getBoundingClientRect = vi.fn(
      () => ({ width: 55, height: 21 }) as DOMRect,
    );
    const { result } = renderHook(() => useElementSize<HTMLDivElement>());
    act(() => result.current.ref(node));
    expect(result.current.isSupported).toBe(false);
    expect({ width: result.current.width, height: result.current.height }).toEqual({
      width: 55,
      height: 21,
    });
  });
});
