import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "bun:test";
import { useLayoutEffect } from "react";

import { useBeforeUnload } from "./useBeforeUnload";

describe("useBeforeUnload", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("blocks only when the latest predicate returns true", () => {
    const first = vi.fn(() => false);
    const second = vi.fn(() => true);
    const { rerender } = renderHook(
      ({ predicate }) => useBeforeUnload(predicate),
      { initialProps: { predicate: first } },
    );

    const allowed = new Event("beforeunload", { cancelable: true });
    act(() => {
      window.dispatchEvent(allowed);
    });
    expect(allowed.defaultPrevented).toBe(false);

    rerender({ predicate: second });
    const blocked = new Event("beforeunload", { cancelable: true });
    act(() => {
      window.dispatchEvent(blocked);
    });
    expect(blocked.defaultPrevented).toBe(true);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("accepts booleans and removes its listener on unmount", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");
    const { rerender, unmount } = renderHook(
      ({ enabled }) => useBeforeUnload(enabled),
      { initialProps: { enabled: false } },
    );
    expect(
      addEventListener.mock.calls.some(([eventName]) => eventName === "beforeunload"),
    ).toBe(false);

    rerender({ enabled: true });
    expect(
      addEventListener.mock.calls.filter(
        ([eventName]) => eventName === "beforeunload",
      ),
    ).toHaveLength(1);
    const blocked = new Event("beforeunload", { cancelable: true });
    act(() => {
      window.dispatchEvent(blocked);
    });
    expect(blocked.defaultPrevented).toBe(true);

    unmount();
    const afterUnmount = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(afterUnmount);
    expect(afterUnmount.defaultPrevented).toBe(false);
  });

  it("subscribes for a predicate and invokes it without a receiver", () => {
    let receiver: unknown = "not called";
    const addEventListener = vi.spyOn(window, "addEventListener");
    renderHook(() =>
      useBeforeUnload(function (this: void) {
        receiver = this;
        return false;
      }),
    );

    expect(
      addEventListener.mock.calls.filter(
        ([eventName]) => eventName === "beforeunload",
      ),
    ).toHaveLength(1);
    act(() => {
      window.dispatchEvent(new Event("beforeunload", { cancelable: true }));
    });
    expect(receiver).toBeUndefined();
  });

  it("publishes the latest predicate before caller layout effects", () => {
    const first = vi.fn(() => false);
    const second = vi.fn(() => true);
    const events: Event[] = [];
    const { rerender } = renderHook(
      ({ predicate, version }) => {
        useBeforeUnload(predicate);
        useLayoutEffect(() => {
          const event = new Event("beforeunload", { cancelable: true });
          events.push(event);
          window.dispatchEvent(event);
        }, [version]);
      },
      { initialProps: { predicate: first, version: 0 } },
    );

    rerender({ predicate: second, version: 1 });
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    expect(events[0]?.defaultPrevented).toBe(false);
    expect(events[1]?.defaultPrevented).toBe(true);
  });
});
