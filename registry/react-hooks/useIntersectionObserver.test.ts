import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "bun:test";

import { useIntersectionObserver } from "./useIntersectionObserver";

const intersectionObserverDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "IntersectionObserver",
);
const instances: IntersectionObserverMock[] = [];

class IntersectionObserverMock {
  readonly disconnect = vi.fn();
  readonly observe = vi.fn();
  readonly takeRecords = vi.fn(() => []);
  readonly unobserve = vi.fn();
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];

  constructor(readonly callback: IntersectionObserverCallback) {
    instances.push(this);
  }

  emit(target: Element, isIntersecting: boolean): void {
    const entry = { isIntersecting, target } as IntersectionObserverEntry;
    this.callback([entry], this as unknown as IntersectionObserver);
  }
}

afterEach(() => {
  if (intersectionObserverDescriptor === undefined) {
    Reflect.deleteProperty(globalThis, "IntersectionObserver");
  } else {
    Object.defineProperty(
      globalThis,
      "IntersectionObserver",
      intersectionObserverDescriptor,
    );
  }
  instances.length = 0;
});

describe("useIntersectionObserver", () => {
  it("uses the latest callback, freezes when visible, and follows node swaps", () => {
    globalThis.IntersectionObserver =
      IntersectionObserverMock as unknown as typeof IntersectionObserver;
    const first = document.createElement("div");
    const second = document.createElement("div");
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();
    const { result, rerender, unmount } = renderHook(
      ({ callback }) =>
        useIntersectionObserver<HTMLDivElement>({
          freezeOnceVisible: true,
          onChange: callback,
        }),
      { initialProps: { callback: firstCallback } },
    );

    act(() => result.current.ref(first));
    rerender({ callback: secondCallback });
    act(() => instances[0]?.emit(first, true));
    expect(result.current.isIntersecting).toBe(true);
    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledTimes(1);
    expect(instances[0]?.disconnect).toHaveBeenCalledTimes(1);

    act(() => result.current.ref(second));
    act(() => instances[0]?.emit(first, false));
    expect(result.current.entry).toBeNull();
    expect(secondCallback).toHaveBeenCalledTimes(1);
    expect(instances[1]?.observe).toHaveBeenCalledWith(second);

    const secondObserver = instances[1];
    act(() => {
      result.current.ref(null);
      result.current.ref(second);
      secondObserver?.emit(second, true);
    });
    expect(result.current.entry).toBeNull();
    expect(secondCallback).toHaveBeenCalledTimes(1);
    expect(instances[2]?.observe).toHaveBeenCalledWith(second);

    unmount();
    expect(instances[2]?.disconnect).toHaveBeenCalledTimes(1);
  });

  it("stays inert when IntersectionObserver is unavailable", () => {
    globalThis.IntersectionObserver =
      undefined as unknown as typeof IntersectionObserver;
    const { result } = renderHook(() =>
      useIntersectionObserver<HTMLDivElement>(),
    );
    act(() => result.current.ref(document.createElement("div")));
    expect(result.current.isSupported).toBe(false);
    expect(result.current.entry).toBeNull();
  });

  it("invokes onChange without an internal ref receiver", () => {
    globalThis.IntersectionObserver =
      IntersectionObserverMock as unknown as typeof IntersectionObserver;
    const node = document.createElement("div");
    let receiver: unknown = "not called";
    function onChange(this: void): void {
      receiver = this;
    }
    const { result } = renderHook(() =>
      useIntersectionObserver<HTMLDivElement>({ onChange }),
    );

    act(() => result.current.ref(node));
    act(() => instances[0]?.emit(node, true));
    expect(receiver).toBeUndefined();
  });
});
