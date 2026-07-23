import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "bun:test";

import { useFocusWithin } from "./useFocusWithin";

describe("useFocusWithin", () => {
  it("stays active while focus moves between descendants and cleans node swaps", () => {
    const root = document.createElement("div");
    const first = document.createElement("button");
    const second = document.createElement("button");
    root.append(first, second);
    const replacement = document.createElement("div");
    const { result } = renderHook(() => useFocusWithin<HTMLDivElement>());

    act(() => result.current.ref(root));
    act(() => first.dispatchEvent(new FocusEvent("focusin", { bubbles: true })));
    expect(result.current.isFocusWithin).toBe(true);
    act(() =>
      first.dispatchEvent(
        new FocusEvent("focusout", { bubbles: true, relatedTarget: second }),
      ),
    );
    expect(result.current.isFocusWithin).toBe(true);
    act(() =>
      second.dispatchEvent(
        new FocusEvent("focusout", {
          bubbles: true,
          relatedTarget: document.body,
        }),
      ),
    );
    expect(result.current.isFocusWithin).toBe(false);
    act(() => result.current.ref(replacement));
    act(() => root.dispatchEvent(new FocusEvent("focusin")));
    expect(result.current.isFocusWithin).toBe(false);
  });

  it("samples activeElement when attached and when re-enabled", () => {
    const root = document.createElement("div");
    const input = document.createElement("input");
    root.append(input);
    document.body.append(root);
    input.focus();
    const { result, rerender } = renderHook(
      ({ enabled }) => useFocusWithin<HTMLDivElement>(enabled),
      { initialProps: { enabled: true } },
    );

    act(() => result.current.ref(root));
    expect(result.current.isFocusWithin).toBe(true);

    rerender({ enabled: false });
    expect(result.current.isFocusWithin).toBe(false);
    expect(document.activeElement).toBe(input);
    rerender({ enabled: true });
    expect(result.current.isFocusWithin).toBe(true);

    root.remove();
  });
});
