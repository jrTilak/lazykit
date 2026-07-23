import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";
import { useLayoutEffect } from "react";

import { useStorageState } from "./useStorageState";

import type { StorageCodec } from "./useStorageState";

describe("useStorageState", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("persists functional updates and synchronizes same-document peers", () => {
    const first = renderHook(() => useStorageState("count", 0));
    const second = renderHook(() => useStorageState("count", 0));

    act(() => {
      first.result.current.setValue((value) => value + 1);
      first.result.current.setValue((value) => value + 1);
    });

    expect(first.result.current.value).toBe(2);
    expect(second.result.current.value).toBe(2);
    expect(localStorage.getItem("count")).toBe("2");

    act(() => {
      first.result.current.remove();
    });
    expect(first.result.current.value).toBe(0);
    expect(second.result.current.value).toBe(0);
  });

  it("uses the persisted codec result as the canonical value", () => {
    type Value = { count: number };
    const codec: StorageCodec<Value> = {
      stringify: (value) => String(value.count),
      parse: (storedValue) => {
        const count = Number(storedValue);
        if (!Number.isSafeInteger(count)) throw new TypeError("invalid count");
        return { count };
      },
    };
    const { result } = renderHook(() =>
      useStorageState("validated", { count: 0 }, { codec }),
    );
    const input = { count: 3 };

    act(() => {
      result.current.setValue(input);
    });
    expect(result.current.value).toEqual({ count: 3 });
    expect(result.current.value).not.toBe(input);
  });

  it("stores callable values only through explicit wrappers", () => {
    type Handler = (value: number) => string;
    const first = vi.fn<Handler>((value) => `first:${value}`);
    const second = vi.fn<Handler>((value) => `second:${value}`);
    const initializer = vi.fn(() => first);
    const codec: StorageCodec<Handler> = {
      parse: (storedValue) => (storedValue === "second" ? second : first),
      stringify: (value) => (value === second ? "second" : "first"),
    };
    const { result } = renderHook(() =>
      useStorageState<Handler>("handler", initializer, { codec }),
    );

    expect(result.current.value).toBe(first);
    expect(initializer).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();

    act(() => {
      result.current.setValue((previous) => {
        expect(previous).toBe(first);
        return second;
      });
    });
    expect(result.current.value).toBe(second);
    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
  });

  it("falls back and reports corrupt persisted values", () => {
    localStorage.setItem("settings", "{bad json");
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useStorageState("settings", { ready: false }, { onError }),
    );

    expect(result.current.value).toEqual({ ready: false });
    expect(result.current.error).toBeInstanceOf(Error);
    expect(onError).toHaveBeenCalled();
  });

  it("reports every failure even when the same error object repeats", () => {
    const error = new Error("storage unavailable");
    const onError = vi.fn();
    const unavailableStorage = {
      getItem: () => null,
      setItem: () => {
        throw error;
      },
    } as unknown as Storage;
    const descriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: unavailableStorage,
    });

    try {
      const { result, unmount } = renderHook(() =>
        useStorageState("key", 0, { onError }),
      );

      act(() => {
        result.current.setValue(1);
        result.current.setValue(2);
      });

      expect(result.current.value).toBe(2);
      expect(result.current.error).toBe(error);
      expect(onError).toHaveBeenCalledTimes(2);
      expect(onError).toHaveBeenNthCalledWith(1, error);
      expect(onError).toHaveBeenNthCalledWith(2, error);
      unmount();
    } finally {
      if (descriptor === undefined) {
        Reflect.deleteProperty(window, "localStorage");
      } else {
        Object.defineProperty(window, "localStorage", descriptor);
      }
    }
  });

  it("isolates storage kinds and responds to key and kind changes", () => {
    type Props = { key: string; storage: "local" | "session" };
    localStorage.setItem("first", '"local"');
    localStorage.setItem("second", '"second"');
    sessionStorage.setItem("first", '"session"');
    const { result, rerender } = renderHook(
      ({ key, storage }: Props) =>
        useStorageState(key, "fallback", { storage }),
      {
        initialProps: {
          key: "first",
          storage: "local" as "local" | "session",
        },
      },
    );

    expect(result.current.value).toBe("local");
    rerender({ key: "second", storage: "local" });
    expect(result.current.value).toBe("second");
    rerender({ key: "first", storage: "session" });
    expect(result.current.value).toBe("session");
  });

  it("uses the fallback that belongs to the current key and storage kind", () => {
    type Props = {
      key: string;
      storage: "local" | "session";
      fallback: string;
    };
    const { result, rerender } = renderHook(
      ({ key, storage, fallback }: Props) =>
        useStorageState(key, fallback, { storage }),
      {
        initialProps: {
          key: "first",
          storage: "local" as Props["storage"],
          fallback: "first fallback",
        },
      },
    );

    expect(result.current.value).toBe("first fallback");
    rerender({
      key: "second",
      storage: "local",
      fallback: "second fallback",
    });
    expect(result.current.value).toBe("second fallback");

    rerender({
      key: "second",
      storage: "session",
      fallback: "session fallback",
    });
    expect(result.current.value).toBe("session fallback");
    act(() => {
      result.current.setValue("changed");
      result.current.remove();
    });
    expect(result.current.value).toBe("session fallback");
  });

  it("publishes a new key fallback before caller layout updates", () => {
    type Props = { key: string; fallback: number; update: boolean };
    let updaterInput: number | undefined;
    const { result, rerender } = renderHook(
      ({ key, fallback, update }: Props) => {
        const stored = useStorageState(key, fallback);
        useLayoutEffect(() => {
          if (!update) return;
          stored.setValue((previous) => {
            updaterInput = previous;
            return previous + 1;
          });
        }, [stored.setValue, update]);
        return stored;
      },
      {
        initialProps: {
          key: "first",
          fallback: 1,
          update: false,
        },
      },
    );

    rerender({ key: "second", fallback: 10, update: true });
    expect(updaterInput).toBe(10);
    expect(result.current.value).toBe(11);
    expect(localStorage.getItem("second")).toBe("11");
  });

  it("re-reads the current value when the codec changes", () => {
    localStorage.setItem("amount", "4");
    const plain: StorageCodec<number> = {
      parse: (storedValue) => Number(storedValue),
      stringify: String,
    };
    const scaled: StorageCodec<number> = {
      parse: (storedValue) => Number(storedValue) * 10,
      stringify: (value) => String(value / 10),
    };
    const { result, rerender } = renderHook(
      ({ codec }) => useStorageState("amount", 0, { codec }),
      { initialProps: { codec: plain } },
    );

    expect(result.current.value).toBe(4);
    rerender({ codec: scaled });
    expect(result.current.value).toBe(40);
  });

  it("handles native clear events and deferred initialization", () => {
    localStorage.setItem("name", '"stored"');
    const { result } = renderHook(() =>
      useStorageState("name", "fallback", { initializeWithValue: false }),
    );
    expect(result.current.value).toBe("stored");

    localStorage.clear();
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: null,
          newValue: null,
          storageArea: localStorage,
        }),
      );
    });
    expect(result.current.value).toBe("fallback");

    act(() => {
      window.dispatchEvent(
        new CustomEvent("lazykit:storage-state", { detail: null }),
      );
      window.dispatchEvent(
        new CustomEvent("lazykit:storage-state", { detail: 1 }),
      );
    });
    expect(result.current.value).toBe("fallback");
  });

  it("keeps in-memory updates when storage operations are unavailable", () => {
    const setError = new Error("set unavailable");
    const removeError = new Error("remove unavailable");
    let failSet = true;
    const unavailableStorage = {
      getItem: () => null,
      setItem: () => {
        if (failSet) throw setError;
      },
      removeItem: () => {
        throw removeError;
      },
    } as unknown as Storage;
    const descriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: unavailableStorage,
    });

    try {
      const { result, unmount } = renderHook(() => useStorageState("key", 0));

      act(() => {
        result.current.setValue(1);
      });
      expect(result.current.value).toBe(1);
      expect(result.current.error).toBe(setError);

      failSet = false;
      act(() => {
        result.current.remove();
      });
      expect(result.current.value).toBe(0);
      expect(result.current.error).toBe(removeError);
      unmount();
    } finally {
      if (descriptor === undefined) {
        Reflect.deleteProperty(window, "localStorage");
      } else {
        Object.defineProperty(window, "localStorage", descriptor);
      }
    }
  });

  it("falls back when reading storage throws", () => {
    const error = new Error("read unavailable");
    const unavailableStorage = {
      getItem: () => {
        throw error;
      },
    } as unknown as Storage;
    const descriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: unavailableStorage,
    });

    try {
      const { result, unmount } = renderHook(() =>
        useStorageState("key", "fallback"),
      );
      expect(result.current.value).toBe("fallback");
      expect(result.current.error).toBe(error);
      unmount();
    } finally {
      if (descriptor === undefined) {
        Reflect.deleteProperty(window, "localStorage");
      } else {
        Object.defineProperty(window, "localStorage", descriptor);
      }
    }
  });
});
