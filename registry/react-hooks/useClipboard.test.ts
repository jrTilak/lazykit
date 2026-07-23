import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";

import { useClipboard } from "./useClipboard";

const deferred = () => {
  let resolve!: () => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<void>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
};

describe("useClipboard", () => {
  const originalClipboard = Object.getOwnPropertyDescriptor(
    navigator,
    "clipboard",
  );

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    if (originalClipboard === undefined) {
      Reflect.deleteProperty(navigator, "clipboard");
    } else {
      Object.defineProperty(navigator, "clipboard", originalClipboard);
    }
  });

  it("copies text and resets success after the configured delay", async () => {
    const writeText = vi.fn(async () => {});
    const clipboard = { writeText };
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: clipboard,
    });
    const { result } = renderHook(() => useClipboard({ resetAfterMs: 50 }));

    expect(result.current.isSupported).toBe(true);
    await act(async () => {
      await result.current.copy("hello");
    });
    expect(writeText).toHaveBeenCalledWith("hello");
    expect(writeText.mock.contexts[0]).toBe(clipboard);
    expect(result.current.state).toEqual({
      status: "success",
      text: "hello",
      error: undefined,
    });

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.state.status).toBe("idle");
  });

  it("reports and rethrows clipboard failures", async () => {
    const error = new Error("denied");
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn(async () => Promise.reject(error)) },
    });
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await expect(result.current.copy("secret")).rejects.toBe(error);
    });
    expect(result.current.state).toEqual({
      status: "error",
      text: undefined,
      error,
    });
  });

  it("lets only the latest copy request update state", async () => {
    const first = deferred();
    const second = deferred();
    const writeText = vi
      .fn<(text: string) => Promise<void>>()
      .mockImplementationOnce(() => first.promise)
      .mockImplementationOnce(() => second.promise);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const { result, unmount } = renderHook(() =>
      useClipboard({ resetAfterMs: null }),
    );

    let firstCopy!: Promise<void>;
    let secondCopy!: Promise<void>;
    act(() => {
      firstCopy = result.current.copy("old");
      secondCopy = result.current.copy("new");
    });
    await act(async () => {
      second.resolve();
      await secondCopy;
    });
    expect(result.current.state.text).toBe("new");
    await act(async () => {
      first.resolve();
      await firstCopy;
    });
    expect(result.current.state.text).toBe("new");

    unmount();
  });

  it("rejects unavailable APIs and invalid reset delays", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    const { result } = renderHook(() => useClipboard());
    expect(result.current.isSupported).toBe(false);
    await act(async () => {
      await expect(result.current.copy("text")).rejects.toThrow(
        "Clipboard API is not available",
      );
    });

    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() =>
        renderHook(() => useClipboard({ resetAfterMs: -1 })),
      ).toThrow(RangeError);
    } finally {
      consoleError.mockRestore();
    }
  });

  it("guards a throwing clipboard getter", async () => {
    const error = new Error("clipboard access denied");
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      get: () => {
        throw error;
      },
    });
    const { result } = renderHook(() => useClipboard());

    expect(result.current.isSupported).toBe(false);
    await act(async () => {
      await expect(result.current.copy("text")).rejects.toBe(error);
    });
    expect(result.current.state).toEqual({
      status: "error",
      text: undefined,
      error,
    });
  });

  it("settles pending copies without writing state after unmount", async () => {
    const success = deferred();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => success.promise },
    });
    const successfulHook = renderHook(() =>
      useClipboard({ resetAfterMs: null }),
    );
    let successfulCopy!: Promise<void>;
    act(() => {
      successfulCopy = successfulHook.result.current.copy("success");
    });
    successfulHook.unmount();
    await act(async () => {
      success.resolve();
      await expect(successfulCopy).resolves.toBeUndefined();
    });

    const failure = deferred();
    const error = new Error("late failure");
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => failure.promise },
    });
    const failingHook = renderHook(() =>
      useClipboard({ resetAfterMs: null }),
    );
    let failingCopy!: Promise<void>;
    act(() => {
      failingCopy = failingHook.result.current.copy("failure");
    });
    const observedFailure = failingCopy.then(
      () => undefined,
      (reason: unknown) => reason,
    );
    failingHook.unmount();
    await act(async () => {
      failure.reject(error);
      expect(await observedFailure).toBe(error);
    });
  });
});
