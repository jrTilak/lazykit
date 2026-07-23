import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "bun:test";

import { useHotkey } from "./useHotkey";

describe("useHotkey", () => {
  it("matches modifiers exactly, ignores editable targets, and uses latest handler", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ enabled, handler }) =>
        useHotkey("mod+shift+k", handler, { enabled }),
      { initialProps: { enabled: true, handler: first } },
    );
    const matching = () =>
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        ctrlKey: true,
        key: "k",
        shiftKey: true,
      });

    const firstEvent = matching();
    act(() => window.dispatchEvent(firstEvent));
    expect(first).toHaveBeenCalledTimes(1);
    expect(firstEvent.defaultPrevented).toBe(true);

    rerender({ enabled: true, handler: second });
    act(() => window.dispatchEvent(matching()));
    expect(second).toHaveBeenCalledTimes(1);

    const input = document.createElement("input");
    document.body.append(input);
    act(() => input.dispatchEvent(matching()));
    expect(second).toHaveBeenCalledTimes(1);
    input.remove();

    rerender({ enabled: false, handler: second });
    act(() => window.dispatchEvent(matching()));
    expect(second).toHaveBeenCalledTimes(1);
    unmount();
  });

  it("rejects multi-key, modifier-only, and ambiguous plus chords", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() =>
        renderHook(() => useHotkey("ctrl+k+x", () => {})),
      ).toThrow("only one non-modifier key");
      expect(() =>
        renderHook(() => useHotkey("ctrl+shift", () => {})),
      ).toThrow("a non-modifier key is required");
      expect(() =>
        renderHook(() => useHotkey("ctrl++", () => {})),
      ).toThrow('use "plus" for the + key');
    } finally {
      consoleError.mockRestore();
    }
  });

  it("requires exact Ctrl/Meta state and treats mod as exactly one of them", () => {
    const target = new EventTarget();
    const handler = vi.fn();
    const { rerender } = renderHook(
      ({ hotkey }) => useHotkey(hotkey, handler, { target }),
      { initialProps: { hotkey: "mod+k" } },
    );
    const dispatch = (ctrlKey: boolean, metaKey: boolean) =>
      target.dispatchEvent(
        new KeyboardEvent("keydown", {
          ctrlKey,
          key: "k",
          metaKey,
        }),
      );

    act(() => dispatch(true, true));
    expect(handler).not.toHaveBeenCalled();
    act(() => dispatch(true, false));
    expect(handler).toHaveBeenCalledTimes(1);

    rerender({ hotkey: "ctrl+meta+k" });
    act(() => dispatch(true, false));
    expect(handler).toHaveBeenCalledTimes(1);
    act(() => dispatch(true, true));
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('uses "plus" for the + key and ignores non-keyboard target events', () => {
    const target = new EventTarget();
    const handler = vi.fn();
    renderHook(() => useHotkey("shift+plus", handler, { target }));

    expect(() =>
      act(() => target.dispatchEvent(new Event("keydown"))),
    ).not.toThrow();
    expect(handler).not.toHaveBeenCalled();

    act(() =>
      target.dispatchEvent(
        new KeyboardEvent("keydown", {
          code: "Equal",
          key: "+",
          shiftKey: true,
        }),
      ),
    );
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("invokes handlers without an internal ref receiver", () => {
    const target = new EventTarget();
    let receiver: unknown = "not called";
    function handler(this: void): void {
      receiver = this;
    }
    renderHook(() => useHotkey("k", handler, { target }));

    act(() =>
      target.dispatchEvent(new KeyboardEvent("keydown", { key: "k" })),
    );
    expect(receiver).toBeUndefined();
  });
});
