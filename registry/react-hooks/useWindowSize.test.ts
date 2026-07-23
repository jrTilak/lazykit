import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "bun:test";

import { useWindowSize } from "./useWindowSize";

const innerWidthDescriptor = Object.getOwnPropertyDescriptor(window, "innerWidth");
const innerHeightDescriptor = Object.getOwnPropertyDescriptor(window, "innerHeight");

afterEach(() => {
  if (innerWidthDescriptor) {
    Object.defineProperty(window, "innerWidth", innerWidthDescriptor);
  } else {
    Reflect.deleteProperty(window, "innerWidth");
  }
  if (innerHeightDescriptor) {
    Object.defineProperty(window, "innerHeight", innerHeightDescriptor);
  } else {
    Reflect.deleteProperty(window, "innerHeight");
  }
});

describe("useWindowSize", () => {
  it("updates on resize and removes both subscriptions", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 800 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 600 });
    const { result, unmount } = renderHook(() => useWindowSize());
    expect(result.current).toEqual({ width: 800, height: 600 });

    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 768 });
    act(() => window.dispatchEvent(new Event("resize")));
    expect(result.current).toEqual({ width: 1024, height: 768 });
    unmount();
    expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(remove).toHaveBeenCalledWith("orientationchange", expect.any(Function));
    remove.mockRestore();
  });
});
