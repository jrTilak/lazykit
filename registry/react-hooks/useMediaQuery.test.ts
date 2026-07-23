import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "bun:test";

import { useMediaQuery } from "./useMediaQuery";

const matchMediaDescriptor = Object.getOwnPropertyDescriptor(
  window,
  "matchMedia",
);

afterEach(() => {
  if (matchMediaDescriptor === undefined) {
    Reflect.deleteProperty(window, "matchMedia");
  } else {
    Object.defineProperty(window, "matchMedia", matchMediaDescriptor);
  }
});

describe("useMediaQuery", () => {
  it("keeps one MediaQueryList per query and responds to changes", () => {
    let matches = false;
    const listeners = new Set<() => void>();
    const list = {
      get matches() {
        return matches;
      },
      media: "(min-width: 40rem)",
      onchange: null,
      addEventListener: vi.fn((_type: string, listener: () => void) => listeners.add(listener)),
      removeEventListener: vi.fn((_type: string, listener: () => void) => listeners.delete(listener)),
    } as unknown as MediaQueryList;
    window.matchMedia = vi.fn(() => list);
    const { result, rerender, unmount } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: "(min-width: 40rem)" } },
    );
    expect(result.current).toBe(false);
    rerender({ query: "(min-width: 40rem)" });
    expect(window.matchMedia).toHaveBeenCalledTimes(1);
    matches = true;
    act(() => listeners.forEach((listener) => listener()));
    expect(result.current).toBe(true);
    unmount();
    expect(list.removeEventListener).toHaveBeenCalled();
  });

  it("uses the fallback when matchMedia is undefined or non-callable", () => {
    for (const matchMedia of [undefined, { matches: false }]) {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        value: matchMedia,
      });
      const { result, unmount } = renderHook(() =>
        useMediaQuery("(prefers-reduced-motion: reduce)", {
          defaultValue: true,
        }),
      );
      expect(result.current).toBe(true);
      unmount();
    }
  });
});
