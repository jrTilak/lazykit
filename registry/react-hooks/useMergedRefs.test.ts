import { createElement, createRef, StrictMode } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, mock, spyOn } from "bun:test";

import type { PropsWithChildren } from "react";

import { useMergedRefs } from "./useMergedRefs";

describe("useMergedRefs", () => {
  it("assigns and clears object and callback refs", () => {
    const objectRef = createRef<HTMLDivElement>();
    const callbackRef = mock((_value: HTMLDivElement | null) => {});
    const { result } = renderHook(() =>
      useMergedRefs(objectRef, callbackRef, null, undefined),
    );
    const element = document.createElement("div");

    act(() => result.current(element));
    expect(objectRef.current).toBe(element);
    expect(callbackRef).toHaveBeenLastCalledWith(element);

    act(() => result.current(null));
    expect(objectRef.current).toBeNull();
    expect(callbackRef).toHaveBeenLastCalledWith(null);
  });

  it("is stable while all input refs are stable", () => {
    const first = createRef<HTMLDivElement>();
    const second = mock((_value: HTMLDivElement | null) => {});
    const { result, rerender } = renderHook(
      ({ callback }) => useMergedRefs(first, callback),
      { initialProps: { callback: second } },
    );
    const merged = result.current;

    rerender({ callback: second });

    expect(result.current).toBe(merged);
  });

  it("stays stable when an input ref changes and targets the new ref", () => {
    const first = mock((_value: HTMLDivElement | null) => {});
    const second = mock((_value: HTMLDivElement | null) => {});
    const { result, rerender } = renderHook(
      ({ callback }) => useMergedRefs(callback),
      { initialProps: { callback: first } },
    );
    const original = result.current;
    const element = document.createElement("div");

    rerender({ callback: second });
    expect(result.current).toBe(original);

    act(() => result.current(element));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(element);
  });

  it("transfers assigned values when refs are added, removed, or reordered", () => {
    const first = createRef<HTMLDivElement>();
    const second = createRef<HTMLDivElement>();
    const error = spyOn(console, "error").mockImplementation(() => {});
    const wrapper = ({ children }: PropsWithChildren) =>
      createElement(StrictMode, null, children);
    const { result, rerender } = renderHook(
      ({ refs }) => useMergedRefs(...refs),
      {
        initialProps: {
          refs: [first] as readonly (
            | typeof first
            | typeof second
          )[],
        },
        wrapper,
      },
    );
    const merged = result.current;
    const element = document.createElement("div");

    act(() => result.current(element));
    rerender({ refs: [second, first] });
    expect(result.current).toBe(merged);
    expect(first.current).toBe(element);
    expect(second.current).toBe(element);

    rerender({ refs: [second] });
    expect(first.current).toBeNull();
    expect(second.current).toBe(element);
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});
