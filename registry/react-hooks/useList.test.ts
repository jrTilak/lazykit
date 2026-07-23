import { useLayoutEffect } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, mock, spyOn } from "bun:test";

import { useList } from "./useList";

describe("useList", () => {
  it("appends, prepends, and inserts values with batched updates", () => {
    const { result } = renderHook(() => useList([2, 3]));

    act(() => {
      result.current.prepend(1);
      result.current.append(5);
      result.current.insertAt(3, 4);
    });

    expect(result.current.items).toEqual([1, 2, 3, 4, 5]);
  });

  it("sets, updates, and removes valid indexes", () => {
    const updater = mock((value: string) => value.toUpperCase());
    const { result } = renderHook(() => useList(["a", "b", "c"]));

    act(() => result.current.setAt(0, "z"));
    act(() => result.current.updateAt(1, updater));
    act(() => result.current.removeAt(2));

    expect(result.current.items).toEqual(["z", "B"]);
    expect(updater).toHaveBeenCalledWith("b", 1, ["z", "b", "c"]);
  });

  it("moves values in either direction and ignores invalid indexes", () => {
    const { result } = renderHook(() => useList(["a", "b", "c", "d"]));

    act(() => result.current.move(1, 3));
    expect(result.current.items).toEqual(["a", "c", "d", "b"]);
    act(() => result.current.move(3, 0));
    expect(result.current.items).toEqual(["b", "a", "c", "d"]);

    const current = result.current.items;
    act(() => {
      result.current.move(-1, 0);
      result.current.move(0, 4);
      result.current.move(1, 1);
    });
    expect(result.current.items).toBe(current);
  });

  it("ignores invalid indexes without creating a new list", () => {
    const { result } = renderHook(() => useList([1, 2]));
    const original = result.current.items;

    act(() => {
      result.current.insertAt(-1, 0);
      result.current.insertAt(3, 3);
      result.current.setAt(2, 3);
      result.current.removeAt(1.5);
    });

    expect(result.current.items).toBe(original);
  });

  it("removes matching values, clears, and resets to the latest input", () => {
    const first = [1, 2, 3, 4] as const;
    const second = [8, 9] as const;
    const { result, rerender } = renderHook(
      ({ initial }) => useList<1 | 2 | 3 | 4 | 8 | 9>(initial),
      { initialProps: { initial: first as readonly (1 | 2 | 3 | 4 | 8 | 9)[] } },
    );

    act(() => result.current.removeWhere((value) => value % 2 === 0));
    expect(result.current.items).toEqual([1, 3]);
    act(() => result.current.clear());
    expect(result.current.items).toEqual([]);

    rerender({ initial: second });
    (second as unknown as number[])[0] = 100;
    act(() => result.current.reset());
    expect(result.current.items).toEqual([8, 9]);
  });

  it("supports direct and functional list replacement", () => {
    const { result } = renderHook(() => useList<number>());

    act(() => result.current.setItems([1, 2]));
    act(() => result.current.setItems((items) => [...items, 3]));

    expect(result.current.items).toEqual([1, 2, 3]);
  });

  it("uses a newly committed reset list from a caller layout effect", () => {
    const { result, rerender } = renderHook(
      ({ initial, resetNow }) => {
        const list = useList(initial);
        useLayoutEffect(() => {
          if (resetNow) list.reset();
        }, [list.reset, resetNow]);
        return list;
      },
      {
        initialProps: {
          initial: [1] as readonly number[],
          resetNow: false,
        },
      },
    );

    act(() => result.current.setItems([9]));
    rerender({ initial: [2], resetNow: true });

    expect(result.current.items).toEqual([2]);
  });

  it("rejects sparse initial and replacement arrays", () => {
    const error = spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() => renderHook(() => useList(new Array<number>(2)))).toThrow(
        "items must not be sparse",
      );
    } finally {
      error.mockRestore();
    }

    const { result } = renderHook(() => useList([1]));
    const updateError = spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() => {
        act(() => result.current.setItems(new Array<number>(2)));
      }).toThrow("items must not be sparse");
    } finally {
      updateError.mockRestore();
    }
  });
});
