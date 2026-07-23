import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "bun:test";

import { useClickOutside } from "./useClickOutside";

describe("useClickOutside", () => {
  it("ignores inside events, follows ref changes, and cleans up", () => {
    const first = document.createElement("div");
    const second = document.createElement("div");
    const ref = { current: first };
    document.body.append(first, second);
    const handler = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ enabled }) => useClickOutside(ref, handler, { enabled }),
      { initialProps: { enabled: true } },
    );

    act(() => first.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })));
    expect(handler).not.toHaveBeenCalled();
    act(() => document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })));
    expect(handler).toHaveBeenCalledTimes(1);

    ref.current = second;
    rerender({ enabled: true });
    act(() => second.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })));
    expect(handler).toHaveBeenCalledTimes(1);
    rerender({ enabled: false });
    act(() => document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })));
    expect(handler).toHaveBeenCalledTimes(1);

    unmount();
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);
    first.remove();
    second.remove();
  });

  it("invokes the outside handler without an internal ref receiver", () => {
    const element = document.createElement("div");
    document.body.append(element);
    let receiver: unknown = "not called";
    function handler(this: void): void {
      receiver = this;
    }
    const { unmount } = renderHook(() =>
      useClickOutside({ current: element }, handler),
    );

    act(() =>
      document.body.dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true }),
      ),
    );
    expect(receiver).toBeUndefined();
    unmount();
    element.remove();
  });
});
