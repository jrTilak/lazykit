import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, mock } from "bun:test";

import { useControllableState } from "./useControllableState";

describe("useControllableState", () => {
  it("manages an uncontrolled value and composes batched updates", () => {
    const onChange = mock((_value: number) => {});
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 1, onChange }),
    );

    expect(result.current.isControlled).toBe(false);
    act(() => {
      result.current.setValue((value) => value + 1);
      result.current.setValue((value) => value * 3);
    });

    expect(result.current.value).toBe(6);
    expect(onChange).toHaveBeenNthCalledWith(1, 2);
    expect(onChange).toHaveBeenNthCalledWith(2, 6);
  });

  it("reports controlled changes without mutating the supplied value", () => {
    const onChange = mock((_value: string) => {});
    const { result, rerender } = renderHook(
      ({ value }) =>
        useControllableState({
          defaultValue: "fallback",
          value,
          onChange,
        }),
      { initialProps: { value: "controlled" } },
    );

    expect(result.current.isControlled).toBe(true);
    act(() => result.current.setValue("requested"));
    expect(result.current.value).toBe("controlled");
    expect(onChange).toHaveBeenCalledWith("requested");

    rerender({ value: "accepted" });
    expect(result.current.value).toBe("accepted");
  });

  it("treats an explicitly undefined value as controlled", () => {
    const { result } = renderHook(() =>
      useControllableState<string | undefined>({
        defaultValue: "fallback",
        value: undefined,
      }),
    );

    expect(result.current.isControlled).toBe(true);
    expect(result.current.value).toBeUndefined();
  });

  it("does not notify for Object.is-equivalent updates", () => {
    const onChange = mock((_value: number) => {});
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: Number.NaN, onChange }),
    );

    act(() => result.current.setValue(Number.NaN));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("keeps its setter stable while using the latest callback", () => {
    const first = mock((_value: number) => {});
    const second = mock((_value: number) => {});
    const { result, rerender } = renderHook(
      ({ onChange }) =>
        useControllableState({ defaultValue: 0, onChange }),
      { initialProps: { onChange: first } },
    );
    const setter = result.current.setValue;

    rerender({ onChange: second });
    act(() => result.current.setValue(1));

    expect(result.current.setValue).toBe(setter);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(1);
  });

  it("uses the last controlled value when switching to uncontrolled mode", () => {
    const { result, rerender } = renderHook(
      ({ controlled, value }) =>
        controlled
          ? useControllableState({ defaultValue: 0, value })
          : useControllableState({ defaultValue: 0 }),
      { initialProps: { controlled: false, value: 0 } },
    );

    act(() => result.current.setValue(1));
    rerender({ controlled: true, value: 10 });
    expect(result.current.value).toBe(10);

    rerender({ controlled: false, value: 10 });
    expect(result.current.value).toBe(10);
    act(() => result.current.setValue((value) => value + 1));
    expect(result.current.value).toBe(11);
  });

  it("preserves function-valued state through updater replacements", () => {
    const first = () => "first";
    const second = () => "second";
    const onChange = mock((_value: () => string) => {});
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: first, onChange }),
    );

    expect(result.current.value).toBe(first);
    act(() => result.current.setValue(() => second));
    expect(result.current.value).toBe(second);
    expect(onChange).toHaveBeenCalledWith(second);
  });
});
