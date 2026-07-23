import { useLayoutEffect } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, mock, spyOn } from "bun:test";

import { useObjectState } from "./useObjectState";

describe("useObjectState", () => {
  it("patches several fields and preserves untouched state", () => {
    const { result } = renderHook(() =>
      useObjectState({ name: "Ada", visits: 1, active: true }),
    );
    const original = result.current.state;

    act(() => result.current.patch({ visits: 2, active: false }));

    expect(result.current.state).toEqual({
      name: "Ada",
      visits: 2,
      active: false,
    });
    expect(result.current.state).not.toBe(original);
    expect(original.visits).toBe(1);
  });

  it("supports typed key replacement and functional key updates", () => {
    const { result } = renderHook(() =>
      useObjectState({
        count: 1,
        formatter: (value: number) => String(value),
      }),
    );
    const formatter = (value: number) => `#${value}`;

    act(() => result.current.setKey("formatter", formatter));
    expect(result.current.state.formatter).toBe(formatter);
    act(() => result.current.updateKey("count", (count) => count + 2));
    expect(result.current.state.count).toBe(3);
  });

  it("composes batched functional patches", () => {
    const patch = mock((state: Readonly<{ count: number; label: string }>) => ({
      count: state.count + 1,
    }));
    const { result } = renderHook(() =>
      useObjectState({ count: 0, label: "ready" }),
    );

    act(() => {
      result.current.patch(patch);
      result.current.patch((state) => ({ count: state.count + 1 }));
    });

    expect(result.current.state.count).toBe(2);
    expect(patch).toHaveBeenCalledWith({ count: 0, label: "ready" });
  });

  it("replaces state, resets to the latest input, and skips no-op patches", () => {
    const first = { count: 1 };
    const second = { count: 10 };
    const { result, rerender } = renderHook(
      ({ initial }) => useObjectState(initial),
      { initialProps: { initial: first } },
    );

    act(() => result.current.setState({ count: 4 }));
    const replaced = result.current.state;
    act(() => result.current.patch({ count: 4 }));
    expect(result.current.state).toBe(replaced);

    rerender({ initial: second });
    second.count = 100;
    act(() => result.current.reset());
    expect(result.current.state).toEqual({ count: 10 });
    expect(result.current.state).not.toBe(second);
  });

  it("supports enumerable symbol keys", () => {
    const status = Symbol("status");
    const { result } = renderHook(() =>
      useObjectState({ [status]: "idle", name: "job" }),
    );

    act(() => result.current.setKey(status, "running"));

    expect(result.current.state[status]).toBe("running");
  });

  it("preserves non-enumerable properties and accessors", () => {
    let getterCalls = 0;
    const initial = { visible: 1 } as {
      visible: number;
      readonly secret: number;
      readonly computed: number;
    };
    Object.defineProperty(initial, "secret", {
      configurable: false,
      enumerable: false,
      value: 42,
      writable: false,
    });
    Object.defineProperty(initial, "computed", {
      configurable: true,
      enumerable: false,
      get() {
        getterCalls += 1;
        return 7;
      },
    });

    const { result } = renderHook(() => useObjectState(initial));
    expect(getterCalls).toBe(0);
    act(() => result.current.patch({ visible: 2 }));

    expect(result.current.state.secret).toBe(42);
    expect(
      Object.getOwnPropertyDescriptor(result.current.state, "secret"),
    ).toEqual({
      configurable: false,
      enumerable: false,
      value: 42,
      writable: false,
    });
    expect(getterCalls).toBe(0);
    expect(result.current.state.computed).toBe(7);
    expect(getterCalls).toBe(1);
  });

  it("preserves null prototypes and safely handles own __proto__ keys", () => {
    type State = {
      count: number;
      __proto__?: { readonly safe: boolean };
    };
    const initial = Object.assign(Object.create(null), {
      count: 1,
    }) as State;
    const protoPatch = Object.create(null) as Partial<State>;
    Object.defineProperty(protoPatch, "__proto__", {
      configurable: true,
      enumerable: true,
      value: { safe: true },
      writable: true,
    });
    const { result } = renderHook(() => useObjectState(initial));

    act(() => result.current.patch(protoPatch));

    expect(Object.getPrototypeOf(result.current.state)).toBeNull();
    expect(Object.hasOwn(result.current.state, "__proto__")).toBe(true);
    expect(result.current.state.__proto__).toEqual({ safe: true });

    act(() => result.current.setKey("__proto__", { safe: false }));
    expect(Object.getPrototypeOf(result.current.state)).toBeNull();
    expect(result.current.state.__proto__).toEqual({ safe: false });
  });

  it("treats new own keys with undefined values as changes", () => {
    const optional = Symbol("optional");
    const { result } = renderHook(() =>
      useObjectState<{
        value: number;
        extra?: string | undefined;
        [optional]?: string | undefined;
      }>({ value: 1 }),
    );
    const original = result.current.state;

    act(() =>
      result.current.patch({ extra: undefined, [optional]: undefined }),
    );

    expect(result.current.state).not.toBe(original);
    expect(Object.hasOwn(result.current.state, "extra")).toBe(true);
    expect(Object.hasOwn(result.current.state, optional)).toBe(true);
  });

  it("rejects arrays, class instances, and invalid replacement values", () => {
    class Model {
      value = 1;
    }
    const error = spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() =>
        renderHook(() =>
          useObjectState(new Model() as unknown as { value: number }),
        ),
      ).toThrow("initialState must be a plain object");
    } finally {
      error.mockRestore();
    }

    const { result } = renderHook(() => useObjectState({ value: 1 }));
    const updateError = spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() => {
        act(() =>
          result.current.setState(
            [] as unknown as { value: number },
          ),
        );
      }).toThrow("state must be a plain object");
    } finally {
      updateError.mockRestore();
    }
  });

  it("uses a newly committed reset object from a caller layout effect", () => {
    const { result, rerender } = renderHook(
      ({ initial, resetNow }) => {
        const object = useObjectState(initial);
        useLayoutEffect(() => {
          if (resetNow) object.reset();
        }, [object.reset, resetNow]);
        return object;
      },
      {
        initialProps: {
          initial: { count: 1 },
          resetNow: false,
        },
      },
    );

    act(() => result.current.setKey("count", 9));
    rerender({ initial: { count: 2 }, resetNow: true });

    expect(result.current.state).toEqual({ count: 2 });
  });
});
