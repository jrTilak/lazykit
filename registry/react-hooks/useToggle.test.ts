import { useLayoutEffect } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, spyOn } from "bun:test";

import { useToggle } from "./useToggle";

describe("useToggle", () => {
  it("toggles between values of different types", () => {
    const { result } = renderHook(() => useToggle("enabled", 0));

    expect(result.current.value).toBe("enabled");
    act(() => result.current.toggle());
    expect(result.current.value).toBe(0);
    act(() => result.current.toggle());
    expect(result.current.value).toBe("enabled");
  });

  it("supports an explicit initial value and functional updates", () => {
    const first = { id: 1 } as const;
    const second = { id: 2 } as const;
    const { result } = renderHook(() => useToggle(first, second, second));

    expect(result.current.value).toBe(second);
    act(() => result.current.setValue((value) =>
      value.id === 1 ? second : first,
    ));
    expect(result.current.value).toBe(first);
  });

  it("composes batched toggles", () => {
    const { result } = renderHook(() => useToggle(false, true));

    act(() => {
      result.current.toggle();
      result.current.toggle();
      result.current.toggle();
    });

    expect(result.current.value).toBe(true);
  });

  it("resets to the first value when the configured pair changes", () => {
    const { result, rerender } = renderHook(
      ({ first, second }) => useToggle(first, second),
      { initialProps: { first: "one", second: "two" } },
    );

    act(() => result.current.toggle());
    expect(result.current.value).toBe("two");

    rerender({ first: "three", second: "four" });
    expect(result.current.value).toBe("three");
  });

  it("toggles from the normalized value during a pair change", () => {
    const { result, rerender } = renderHook(
      ({ first, second, toggleNow }) => {
        const toggle = useToggle(first, second);
        useLayoutEffect(() => {
          if (toggleNow) toggle.toggle();
        }, [toggle.toggle, toggleNow]);
        return toggle;
      },
      {
        initialProps: {
          first: "a",
          second: "b",
          toggleNow: false,
        },
      },
    );

    act(() => result.current.toggle());
    rerender({ first: "c", second: "d", toggleNow: true });

    expect(result.current.value).toBe("d");
  });

  it("preserves function-valued toggle choices", () => {
    const first = () => "first";
    const second = () => "second";
    const replacement = () => "replacement";
    const replacementSecond = () => "replacement-second";
    const { result, rerender } = renderHook(
      ({ left, right }) => useToggle(left, right),
      { initialProps: { left: first, right: second } },
    );

    expect(result.current.value).toBe(first);
    act(() => result.current.toggle());
    expect(result.current.value).toBe(second);
    act(() => result.current.setValue(() => first));
    expect(result.current.value).toBe(first);

    rerender({ left: replacement, right: replacementSecond });
    expect(result.current.value).toBe(replacement);
    act(() => result.current.toggle());
    expect(result.current.value).toBe(replacementSecond);
  });

  it("rejects values outside the configured pair", () => {
    const error = spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() =>
        renderHook(() =>
          useToggle("left", "right", "other" as unknown as "left"),
        ),
      ).toThrow("initialValue must be one of the two toggle values");
    } finally {
      error.mockRestore();
    }

    const { result } = renderHook(() => useToggle("left", "right"));
    const updateError = spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() => {
        act(() => result.current.setValue("other" as unknown as "left"));
      }).toThrow("value must be one of the two toggle values");
    } finally {
      updateError.mockRestore();
    }
  });
});
