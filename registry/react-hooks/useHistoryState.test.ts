import { useLayoutEffect } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, mock, spyOn } from "bun:test";

import { useHistoryState } from "./useHistoryState";

describe("useHistoryState", () => {
  it("records updates and walks backward and forward", () => {
    const { result } = renderHook(() => useHistoryState("a"));

    act(() => result.current.setState("b"));
    act(() => result.current.setState("c"));
    expect(result.current.state).toBe("c");
    expect(result.current.canUndo).toBe(true);

    act(() => result.current.undo());
    expect(result.current.state).toBe("b");
    expect(result.current.canRedo).toBe(true);
    act(() => result.current.undo());
    expect(result.current.state).toBe("a");
    expect(result.current.canUndo).toBe(false);

    act(() => result.current.redo());
    expect(result.current.state).toBe("b");
  });

  it("composes batched updates into separate history entries", () => {
    const { result } = renderHook(() => useHistoryState(1));

    act(() => {
      result.current.setState((value) => value + 1);
      result.current.setState((value) => value * 3);
    });
    expect(result.current.state).toBe(6);

    act(() => result.current.undo());
    expect(result.current.state).toBe(2);
    act(() => result.current.undo());
    expect(result.current.state).toBe(1);
  });

  it("clears redo history after branching from an undo", () => {
    const { result } = renderHook(() => useHistoryState(0));

    act(() => result.current.setState(1));
    act(() => result.current.setState(2));
    act(() => result.current.undo());
    expect(result.current.canRedo).toBe(true);

    act(() => result.current.setState(10));
    expect(result.current.state).toBe(10);
    expect(result.current.canRedo).toBe(false);
  });

  it("limits retained history and supports a zero limit", () => {
    const { result } = renderHook(() =>
      useHistoryState(0, { maxHistory: 2 }),
    );

    act(() => {
      result.current.setState(1);
      result.current.setState(2);
      result.current.setState(3);
    });
    act(() => result.current.undo());
    expect(result.current.state).toBe(2);
    act(() => result.current.undo());
    expect(result.current.state).toBe(1);
    expect(result.current.canUndo).toBe(false);

    const zero = renderHook(() =>
      useHistoryState(0, { maxHistory: 0 }),
    );
    act(() => zero.result.current.setState(1));
    expect(zero.result.current.canUndo).toBe(false);
  });

  it("prunes all past entries when maxHistory changes to zero", () => {
    const { result, rerender } = renderHook(
      ({ maxHistory }) => useHistoryState(0, { maxHistory }),
      { initialProps: { maxHistory: 3 } },
    );

    act(() => {
      result.current.setState(1);
      result.current.setState(2);
    });
    expect(result.current.canUndo).toBe(true);

    rerender({ maxHistory: 0 });
    expect(result.current.canUndo).toBe(false);
  });

  it("uses custom equality and skips equivalent updates", () => {
    const isEqual = mock(
      (left: Readonly<{ id: number }>, right: Readonly<{ id: number }>) =>
        left.id === right.id,
    );
    const { result } = renderHook(() =>
      useHistoryState({ id: 1 }, { isEqual }),
    );

    act(() => result.current.setState({ id: 1 }));

    expect(result.current.state).toEqual({ id: 1 });
    expect(result.current.canUndo).toBe(false);
    expect(isEqual).toHaveBeenCalledTimes(1);
  });

  it("clears history and resets to the latest initial value", () => {
    const { result, rerender } = renderHook(
      ({ initial }) => useHistoryState(initial),
      { initialProps: { initial: "first" } },
    );

    act(() => result.current.setState("changed"));
    act(() => result.current.clearHistory());
    expect(result.current.state).toBe("changed");
    expect(result.current.canUndo).toBe(false);

    rerender({ initial: "latest" });
    act(() => result.current.reset());
    expect(result.current.state).toBe("latest");
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it("uses a newly committed reset value from a caller layout effect", () => {
    const { result, rerender } = renderHook(
      ({ initial, resetNow }) => {
        const history = useHistoryState(initial);
        useLayoutEffect(() => {
          if (resetNow) history.reset();
        }, [history.reset, resetNow]);
        return history;
      },
      { initialProps: { initial: "first", resetNow: false } },
    );

    act(() => result.current.setState("changed"));
    rerender({ initial: "latest", resetNow: true });

    expect(result.current.state).toBe("latest");
  });

  it("supports undefined, symbols, and function-valued states", () => {
    const undefinedState = renderHook(() =>
      useHistoryState<string | undefined>(undefined),
    );
    act(() => undefinedState.result.current.setState("ready"));
    act(() => undefinedState.result.current.undo());
    expect(undefinedState.result.current.state).toBeUndefined();

    const firstSymbol = Symbol("first");
    const secondSymbol = Symbol("second");
    const symbols = renderHook(() =>
      useHistoryState<symbol>(firstSymbol),
    );
    act(() => symbols.result.current.setState(secondSymbol));
    act(() => symbols.result.current.undo());
    expect(symbols.result.current.state).toBe(firstSymbol);

    const first = () => "first";
    const second = () => "second";
    const functions = renderHook(() => useHistoryState(first));
    act(() => functions.result.current.setState(() => second));
    expect(functions.result.current.state).toBe(second);
    act(() => functions.result.current.undo());
    expect(functions.result.current.state).toBe(first);
  });

  it("keeps redo valid when the history limit shrinks", () => {
    const { result, rerender } = renderHook(
      ({ maxHistory }) => useHistoryState(0, { maxHistory }),
      { initialProps: { maxHistory: 3 } },
    );

    act(() => {
      result.current.setState(1);
      result.current.setState(2);
      result.current.setState(3);
    });
    act(() => {
      result.current.undo();
      result.current.undo();
    });
    expect(result.current.state).toBe(1);

    rerender({ maxHistory: 1 });
    act(() => result.current.redo());
    expect(result.current.state).toBe(2);
    expect(result.current.canUndo).toBe(true);
    act(() => result.current.redo());
    expect(result.current.state).toBe(3);
    act(() => result.current.undo());
    expect(result.current.state).toBe(2);
    expect(result.current.canUndo).toBe(false);
  });

  it("rejects invalid history limits", () => {
    const error = spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() =>
        renderHook(() => useHistoryState(0, { maxHistory: -1 })),
      ).toThrow("maxHistory must be a non-negative safe integer");
      expect(() =>
        renderHook(() => useHistoryState(0, { maxHistory: 1.5 })),
      ).toThrow("maxHistory must be a non-negative safe integer");
    } finally {
      error.mockRestore();
    }
  });
});
