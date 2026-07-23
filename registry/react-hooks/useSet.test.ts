import { useLayoutEffect } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, mock, spyOn } from "bun:test";

import { useSet } from "./useSet";

describe("useSet", () => {
  it("adds, removes, and toggles values immutably", () => {
    const { result } = renderHook(() => useSet([1, 2]));
    const original = result.current.set;

    act(() => result.current.add(3));
    expect(Array.from(result.current.set)).toEqual([1, 2, 3]);
    expect(original).toEqual(new Set([1, 2]));

    act(() => result.current.remove(1));
    act(() => result.current.toggle(2));
    act(() => result.current.toggle(4));
    expect(Array.from(result.current.set)).toEqual([3, 4]);
  });

  it("consumes addMany iterables once and composes batched changes", () => {
    const { result } = renderHook(() => useSet<string>());
    const iterator = mock(function* () {
      yield "a";
      yield "b";
    });

    act(() => {
      result.current.addMany(iterator());
      result.current.add("c");
    });

    expect(iterator).toHaveBeenCalledTimes(1);
    expect(Array.from(result.current.set)).toEqual(["a", "b", "c"]);
  });

  it("retains identity for duplicate additions and missing removals", () => {
    const { result } = renderHook(() => useSet(["a"]));
    const original = result.current.set;

    act(() => {
      result.current.add("a");
      result.current.addMany(["a", "a"]);
      result.current.remove("missing");
    });

    expect(result.current.set).toBe(original);
  });

  it("clears and resets to the latest input", () => {
    const first = new Set([1, 2]);
    const second = new Set([8, 9]);
    const { result, rerender } = renderHook(
      ({ initial }) => useSet(initial),
      { initialProps: { initial: first } },
    );

    act(() => result.current.clear());
    expect(result.current.set.size).toBe(0);
    rerender({ initial: second });
    second.add(10);
    act(() => result.current.reset());
    expect(result.current.set).toEqual(new Set([8, 9]));
    expect(result.current.set).not.toBe(second);
  });

  it("uses a newly committed reset set from a caller layout effect", () => {
    const { result, rerender } = renderHook(
      ({ initial, resetNow }) => {
        const set = useSet(initial);
        useLayoutEffect(() => {
          if (resetNow) set.reset();
        }, [resetNow, set.reset]);
        return set;
      },
      {
        initialProps: {
          initial: [1] as readonly number[],
          resetNow: false,
        },
      },
    );

    act(() => result.current.add(9));
    rerender({ initial: [2], resetNow: true });

    expect(result.current.set).toEqual(new Set([2]));
  });

  it("rejects sparse arrays while preserving explicit undefined values", () => {
    const error = spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() =>
        renderHook(() => useSet<number>(new Array<number>(2))),
      ).toThrow("values must not be sparse");
    } finally {
      error.mockRestore();
    }

    const valid = renderHook(() =>
      useSet<number | undefined>([undefined]),
    );
    expect(valid.result.current.set.has(undefined)).toBe(true);

    const updateError = spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() => {
        act(() =>
          valid.result.current.addMany(
            new Array<number | undefined>(1),
          ),
        );
      }).toThrow("values must not be sparse");
    } finally {
      updateError.mockRestore();
    }
  });
});
