import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "bun:test";

import { useHover } from "./useHover";

describe("useHover", () => {
  it("tracks hover, follows node swaps, and respects disabled state", () => {
    const first = document.createElement("div");
    const second = document.createElement("div");
    const { result, rerender } = renderHook(
      ({ enabled }) => useHover<HTMLDivElement>(enabled),
      { initialProps: { enabled: true } },
    );
    act(() => result.current.ref(first));
    act(() => first.dispatchEvent(new PointerEvent("pointerenter")));
    expect(result.current.isHovered).toBe(true);
    act(() => result.current.ref(second));
    expect(result.current.isHovered).toBe(false);
    act(() => first.dispatchEvent(new PointerEvent("pointerenter")));
    expect(result.current.isHovered).toBe(false);
    act(() => second.dispatchEvent(new PointerEvent("pointerenter")));
    expect(result.current.isHovered).toBe(true);
    rerender({ enabled: false });
    expect(result.current.isHovered).toBe(false);
  });
});
