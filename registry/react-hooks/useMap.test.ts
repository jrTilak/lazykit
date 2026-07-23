import { useLayoutEffect } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, mock } from "bun:test";

import { useMap } from "./useMap";

describe("useMap", () => {
  it("sets, updates, and removes entries without mutating prior maps", () => {
    const { result } = renderHook(() =>
      useMap<string, number>([["a", 1]]),
    );
    const original = result.current.map;

    act(() => result.current.set("b", 2));
    expect(result.current.map).toEqual(new Map([["a", 1], ["b", 2]]));
    expect(original).toEqual(new Map([["a", 1]]));

    act(() => result.current.update("a", (value) => (value ?? 0) + 4));
    expect(result.current.map.get("a")).toBe(5);
    act(() => result.current.remove("b"));
    expect(result.current.map.has("b")).toBe(false);
  });

  it("applies iterable entries once and composes batched writes", () => {
    const { result } = renderHook(() => useMap<string, number>());
    const iterator = mock(function* () {
      yield ["a", 1] as const;
      yield ["b", 2] as const;
    });

    act(() => {
      result.current.setMany(iterator());
      result.current.set("c", 3);
    });

    expect(iterator).toHaveBeenCalledTimes(1);
    expect(Array.from(result.current.map)).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });

  it("retains the map identity for no-op changes", () => {
    const { result } = renderHook(() =>
      useMap<string, number>([["a", 1]]),
    );
    const original = result.current.map;

    act(() => {
      result.current.set("a", 1);
      result.current.remove("missing" as "a");
      result.current.setMany([["a", 1]]);
    });

    expect(result.current.map).toBe(original);
  });

  it("compares the net result of duplicate setMany entries", () => {
    const { result } = renderHook(() =>
      useMap<string, number>([["a", 1]]),
    );
    const original = result.current.map;

    act(() => result.current.setMany([["a", 2], ["a", 1]]));

    expect(result.current.map).toBe(original);
  });

  it("clears and resets to the latest initial entries", () => {
    const first = new Map([["a", 1]]);
    const second = new Map([["b", 2]]);
    const { result, rerender } = renderHook(
      ({ initial }) => useMap(initial),
      { initialProps: { initial: first } },
    );

    act(() => result.current.clear());
    expect(result.current.map.size).toBe(0);
    rerender({ initial: second });
    second.set("mutated", 3);
    act(() => result.current.reset());
    expect(result.current.map).toEqual(new Map([["b", 2]]));
    expect(result.current.map).not.toBe(second);
  });

  it("supports undefined values without confusing them with missing keys", () => {
    const { result } = renderHook(() =>
      useMap<string, number | undefined>([["present", undefined]]),
    );
    const original = result.current.map;

    act(() => result.current.set("present", undefined));
    expect(result.current.map).toBe(original);
    const observations: boolean[] = [];
    act(() =>
      result.current.update("present", (_value, exists) => {
        observations.push(exists);
        return undefined;
      }),
    );
    act(() =>
      result.current.update("missing", (_value, exists) => {
        observations.push(exists);
        return undefined;
      }),
    );
    expect(observations).toEqual([true, false]);
    expect(result.current.map.has("missing")).toBe(true);
  });

  it("supports symbol keys and resets from the latest layout", () => {
    const first = Symbol("first");
    const second = Symbol("second");
    const { result, rerender } = renderHook(
      ({ initial, resetNow }) => {
        const map = useMap<symbol, number | undefined>(initial);
        useLayoutEffect(() => {
          if (resetNow) map.reset();
        }, [map.reset, resetNow]);
        return map;
      },
      {
        initialProps: {
          initial: new Map<symbol, number | undefined>([
            [first, undefined],
          ]),
          resetNow: false,
        },
      },
    );

    act(() => result.current.set(first, 1));
    rerender({
      initial: new Map([[second, undefined]]),
      resetNow: true,
    });

    expect(result.current.map.has(first)).toBe(false);
    expect(result.current.map.has(second)).toBe(true);
    expect(result.current.map.get(second)).toBeUndefined();
  });
});
