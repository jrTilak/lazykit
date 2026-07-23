import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, spyOn } from "bun:test";

import { useBoolean } from "./useBoolean";

describe("useBoolean", () => {
  it("defaults to false and exposes stable controls", () => {
    const { result, rerender } = renderHook(() => useBoolean());
    const controls = {
      setValue: result.current.setValue,
      setTrue: result.current.setTrue,
      setFalse: result.current.setFalse,
      toggle: result.current.toggle,
    };

    expect(result.current.value).toBe(false);
    rerender();
    expect(result.current.setValue).toBe(controls.setValue);
    expect(result.current.setTrue).toBe(controls.setTrue);
    expect(result.current.setFalse).toBe(controls.setFalse);
    expect(result.current.toggle).toBe(controls.toggle);
  });

  it("sets true, false, and toggles from the current state", () => {
    const { result } = renderHook(() => useBoolean(true));

    act(() => result.current.setFalse());
    expect(result.current.value).toBe(false);

    act(() => result.current.setTrue());
    expect(result.current.value).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.value).toBe(false);
  });

  it("supports functional updates and batched toggles", () => {
    const { result } = renderHook(() => useBoolean());

    act(() => {
      result.current.setValue((value) => !value);
      result.current.toggle();
      result.current.toggle();
    });

    expect(result.current.value).toBe(true);
  });

  it("rejects invalid JavaScript callers", () => {
    const error = spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() =>
        renderHook(() => useBoolean("yes" as unknown as boolean)),
      ).toThrow("initialValue must be a boolean");
    } finally {
      error.mockRestore();
    }

    const direct = renderHook(() => useBoolean());
    const updateError = spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() => {
        act(() =>
          direct.result.current.setValue("yes" as unknown as boolean),
        );
      }).toThrow("value must be a boolean");
    } finally {
      updateError.mockRestore();
    }

    const functional = renderHook(() => useBoolean());
    const functionalError = spyOn(console, "error").mockImplementation(
      () => {},
    );
    try {
      expect(() => {
        act(() =>
          functional.result.current.setValue(
            (() => "yes") as unknown as (value: boolean) => boolean,
          ),
        );
      }).toThrow("value must be a boolean");
    } finally {
      functionalError.mockRestore();
    }
  });
});
