import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "bun:test";

import { usePrevious } from "./usePrevious";

describe("usePrevious", () => {
  it("returns undefined before the value has changed", () => {
    const { result } = renderHook(() => usePrevious("first"));

    expect(result.current).toBeUndefined();
  });

  it("returns each value from the preceding committed render", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: "first" } },
    );

    rerender({ value: "second" });
    expect(result.current).toBe("first");

    rerender({ value: "third" });
    expect(result.current).toBe("second");
  });

  it("supports an explicit initial previous value", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value, null),
      { initialProps: { value: { id: 1 } } },
    );

    expect(result.current).toBeNull();

    const next = { id: 2 };
    rerender({ value: next });
    expect(result.current).toEqual({ id: 1 });
  });

  it("tracks object identity without cloning values", () => {
    const first = { id: 1 };
    const second = { id: 2 };
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: first } },
    );

    rerender({ value: second });

    expect(result.current).toBe(first);
  });
});
