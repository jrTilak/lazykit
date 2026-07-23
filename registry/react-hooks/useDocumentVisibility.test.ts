import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "bun:test";

import { useDocumentVisibility } from "./useDocumentVisibility";

const visibilityDescriptor = Object.getOwnPropertyDescriptor(
  document,
  "visibilityState",
);

afterEach(() => {
  if (visibilityDescriptor) {
    Object.defineProperty(document, "visibilityState", visibilityDescriptor);
  } else {
    Reflect.deleteProperty(document, "visibilityState");
  }
});

describe("useDocumentVisibility", () => {
  it("tracks visibility changes", () => {
    let state: DocumentVisibilityState = "visible";
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => state,
    });
    const { result } = renderHook(() => useDocumentVisibility());
    expect(result.current).toBe("visible");
    state = "hidden";
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(result.current).toBe("hidden");
  });
});
