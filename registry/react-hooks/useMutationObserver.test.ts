import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "bun:test";

import { useMutationObserver } from "./useMutationObserver";

const mutationObserverDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "MutationObserver",
);
const instances: MutationObserverMock[] = [];

class MutationObserverMock {
  readonly disconnect = vi.fn();
  readonly observe = vi.fn();
  readonly takeRecords = vi.fn(() => []);

  constructor(readonly callback: MutationCallback) {
    instances.push(this);
  }

  emit(): void {
    this.callback([], this as unknown as MutationObserver);
  }
}

afterEach(() => {
  if (mutationObserverDescriptor === undefined) {
    Reflect.deleteProperty(globalThis, "MutationObserver");
  } else {
    Object.defineProperty(
      globalThis,
      "MutationObserver",
      mutationObserverDescriptor,
    );
  }
  instances.length = 0;
});

describe("useMutationObserver", () => {
  it("defaults to child-list mutations, updates callbacks, and disconnects", () => {
    globalThis.MutationObserver =
      MutationObserverMock as unknown as typeof MutationObserver;
    const node = document.createElement("div");
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender, unmount } = renderHook(
      ({ callback, enabled }) =>
        useMutationObserver<HTMLDivElement>(callback, { enabled }),
      { initialProps: { callback: first, enabled: true } },
    );

    act(() => result.current.ref(node));
    expect(instances[0]?.observe).toHaveBeenCalledWith(
      node,
      expect.objectContaining({ childList: true }),
    );
    rerender({ callback: second, enabled: true });
    act(() => instances[0]?.emit());
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);

    const replacement = document.createElement("div");
    act(() => {
      result.current.ref(replacement);
      instances[0]?.emit();
    });
    expect(second).toHaveBeenCalledTimes(1);
    expect(instances[1]?.observe).toHaveBeenCalledWith(
      replacement,
      expect.any(Object),
    );

    const replacementObserver = instances[1];
    act(() => {
      result.current.ref(null);
      result.current.ref(replacement);
      replacementObserver?.emit();
    });
    expect(second).toHaveBeenCalledTimes(1);
    expect(instances[2]?.observe).toHaveBeenCalledWith(
      replacement,
      expect.any(Object),
    );

    rerender({ callback: second, enabled: false });
    expect(instances[2]?.disconnect).toHaveBeenCalledTimes(1);
    unmount();
  });

  it("adds childList when subtree is the only supplied option", () => {
    globalThis.MutationObserver =
      MutationObserverMock as unknown as typeof MutationObserver;
    const node = document.createElement("div");
    const { result } = renderHook(() =>
      useMutationObserver<HTMLDivElement>(() => {}, { subtree: true }),
    );
    act(() => result.current.ref(node));
    expect(instances[0]?.observe).toHaveBeenCalledWith(
      node,
      expect.objectContaining({ childList: true, subtree: true }),
    );
  });

  it("rejects invalid modes and stays inert when unsupported", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() =>
        renderHook(() =>
          useMutationObserver(() => {}, {
            attributes: false,
            attributeOldValue: true,
          }),
        ),
      ).toThrow("attributes cannot be false");
    } finally {
      consoleError.mockRestore();
    }
    globalThis.MutationObserver =
      undefined as unknown as typeof MutationObserver;
    const { result } = renderHook(() => useMutationObserver(() => {}));
    act(() => result.current.ref(document.createElement("div")));
    expect(result.current.isSupported).toBe(false);
  });

  it("invokes callbacks without an internal ref receiver", () => {
    globalThis.MutationObserver =
      MutationObserverMock as unknown as typeof MutationObserver;
    const node = document.createElement("div");
    let receiver: unknown = "not called";
    const callback: MutationCallback = function (this: unknown): void {
      receiver = this;
    };
    const { result } = renderHook(() =>
      useMutationObserver<HTMLDivElement>(callback),
    );

    act(() => result.current.ref(node));
    act(() => instances[0]?.emit());
    expect(receiver).toBeUndefined();
  });
});
