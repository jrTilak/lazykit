import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "bun:test";

import { useOnlineStatus } from "./useOnlineStatus";

const onLineDescriptor = Object.getOwnPropertyDescriptor(navigator, "onLine");

afterEach(() => {
  if (onLineDescriptor) {
    Object.defineProperty(navigator, "onLine", onLineDescriptor);
  } else {
    Reflect.deleteProperty(navigator, "onLine");
  }
});

describe("useOnlineStatus", () => {
  it("tracks online and offline events without depending on storage", () => {
    let online = true;
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      get: () => online,
    });
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);
    online = false;
    act(() => window.dispatchEvent(new Event("offline")));
    expect(result.current).toBe(false);
    online = true;
    act(() => window.dispatchEvent(new Event("online")));
    expect(result.current).toBe(true);
  });
});
