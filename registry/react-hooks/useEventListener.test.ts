import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "bun:test";
import { createElement, StrictMode } from "react";

import { useEventListener } from "./useEventListener";

import type { PropsWithChildren, ReactElement } from "react";

const strictWrapper = ({ children }: PropsWithChildren): ReactElement =>
  createElement(StrictMode, null, children);

describe("useEventListener", () => {
  it("uses the latest handler and removes listeners when disabled or unmounted", () => {
    const target = new EventTarget();
    const first = vi.fn();
    const second = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ enabled, handler }) =>
        useEventListener(target, "change", handler, { enabled }),
      { initialProps: { enabled: true, handler: first } },
    );

    act(() => target.dispatchEvent(new Event("change")));
    expect(first).toHaveBeenCalledTimes(1);
    rerender({ enabled: true, handler: second });
    act(() => target.dispatchEvent(new Event("change")));
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);

    rerender({ enabled: false, handler: second });
    act(() => target.dispatchEvent(new Event("change")));
    expect(second).toHaveBeenCalledTimes(1);
    unmount();
    target.dispatchEvent(new Event("change"));
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("resolves a stable ref after commit and follows its node on rerender", () => {
    const first = new EventTarget();
    const second = new EventTarget();
    const ref: { current: EventTarget | null } = { current: null };
    const handler = vi.fn();
    const { rerender } = renderHook(() =>
      useEventListener(ref, "change", handler),
    );
    ref.current = first;
    rerender();
    act(() => first.dispatchEvent(new Event("change")));
    expect(handler).toHaveBeenCalledTimes(1);
    ref.current = second;
    rerender();
    act(() => first.dispatchEvent(new Event("change")));
    act(() => second.dispatchEvent(new Event("change")));
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it("does not re-arm a consumed once listener on unrelated rerenders", () => {
    const target = new EventTarget();
    const add = vi.spyOn(target, "addEventListener");
    const handler = vi.fn();
    const { rerender } = renderHook(
      ({ marker }) => {
        void marker;
        useEventListener(target, "change", handler, { once: true });
      },
      { initialProps: { marker: 0 } },
    );

    act(() => target.dispatchEvent(new Event("change")));
    rerender({ marker: 1 });
    act(() => target.dispatchEvent(new Event("change")));

    expect(handler).toHaveBeenCalledTimes(1);
    expect(add).toHaveBeenCalledTimes(1);
  });

  it("keeps one live listener through StrictMode effect replay", () => {
    const target = new EventTarget();
    const handler = vi.fn();
    const { unmount } = renderHook(
      () => useEventListener(target, "change", handler),
      { wrapper: strictWrapper },
    );

    act(() => target.dispatchEvent(new Event("change")));
    expect(handler).toHaveBeenCalledTimes(1);
    unmount();
    target.dispatchEvent(new Event("change"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("invokes handlers without an internal ref receiver", () => {
    const target = new EventTarget();
    let receiver: unknown = "not called";
    function handler(this: void): void {
      receiver = this;
    }
    renderHook(() => useEventListener(target, "change", handler));

    act(() => target.dispatchEvent(new Event("change")));
    expect(receiver).toBeUndefined();
  });
});
