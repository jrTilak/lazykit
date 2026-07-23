import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "bun:test";
import { StrictMode, useLayoutEffect } from "react";

import { useAsyncTask } from "./useAsyncTask";

const deferred = <Value>() => {
  let resolve!: (value: Value) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<Value>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
};

describe("useAsyncTask", () => {
  it("handles synchronous values, thenables, and synchronous errors", async () => {
    type Mode = "value" | "thenable" | "error";
    type Props = { mode: Mode };
    const { result, rerender } = renderHook(
      ({ mode }: Props) =>
        useAsyncTask((_signal, input: number) => {
          if (mode === "error") throw new Error("failed");
          if (mode === "thenable") {
            const promise = Promise.resolve(input * 3);
            return {
              then: promise.then.bind(promise),
            } satisfies PromiseLike<number>;
          }
          return input * 2;
        }),
      { initialProps: { mode: "value" as Mode } },
    );

    await act(async () => {
      expect(await result.current.run(2)).toBe(4);
    });
    expect(result.current.state).toEqual({
      status: "success",
      data: 4,
      error: undefined,
    });

    rerender({ mode: "thenable" });
    await act(async () => {
      expect(await result.current.run(2)).toBe(6);
    });

    rerender({ mode: "error" });
    await act(async () => {
      await expect(result.current.run(2)).rejects.toThrow("failed");
    });
    expect(result.current.state.status).toBe("error");
  });

  it("lets only the latest run update state", async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const { result } = renderHook(() =>
      useAsyncTask(
        (_signal, id: "first" | "second") =>
          id === "first" ? first.promise : second.promise,
        { abortPrevious: false },
      ),
    );

    let firstRun!: Promise<string>;
    let secondRun!: Promise<string>;
    act(() => {
      firstRun = result.current.run("first");
      secondRun = result.current.run("second");
    });

    await act(async () => {
      second.resolve("new");
      await secondRun;
    });
    expect(result.current.state.status).toBe("success");
    expect(result.current.state.data).toBe("new");

    await act(async () => {
      first.resolve("old");
      await firstRun;
    });
    expect(result.current.state.data).toBe("new");
  });

  it("aborts every active task on abort and unmount", () => {
    const signals: AbortSignal[] = [];
    const { result, unmount } = renderHook(() =>
      useAsyncTask(
        (signal) => {
          signals.push(signal);
          return new Promise<never>(() => {});
        },
        { abortPrevious: false },
      ),
    );

    act(() => {
      void result.current.run();
      void result.current.run();
      result.current.abort();
    });
    expect(signals.every((signal) => signal.aborted)).toBe(true);
    expect(result.current.state.status).toBe("idle");

    act(() => {
      void result.current.run();
    });
    unmount();
    expect(signals.at(-1)?.aborted).toBe(true);
  });

  it("aborts the previous run by default", () => {
    const signals: AbortSignal[] = [];
    const { result } = renderHook(() =>
      useAsyncTask((signal) => {
        signals.push(signal);
        return new Promise<never>(() => {});
      }),
    );

    act(() => {
      void result.current.run();
      void result.current.run();
    });

    expect(signals[0]?.aborted).toBe(true);
    expect(signals[1]?.aborted).toBe(false);
  });

  it("does not abort a task started reentrantly by an abort listener", () => {
    const signals: AbortSignal[] = [];
    let rerun = () => {};
    const { result, unmount } = renderHook(() =>
      useAsyncTask((signal, label: "first" | "reentrant") => {
        signals.push(signal);
        if (label === "first") {
          signal.addEventListener("abort", () => rerun(), { once: true });
        }
        return new Promise<never>(() => {});
      }),
    );
    rerun = () => {
      void result.current.run("reentrant");
    };

    act(() => {
      void result.current.run("first");
      result.current.abort();
    });

    expect(signals).toHaveLength(2);
    expect(signals[0]?.aborted).toBe(true);
    expect(signals[1]?.aborted).toBe(false);
    expect(result.current.state.status).toBe("pending");
    unmount();
    expect(signals[1]?.aborted).toBe(true);
  });

  it("is ready for a caller layout effect, including Strict Mode replay", async () => {
    const signals: AbortSignal[] = [];
    const task = vi.fn(async (signal: AbortSignal, value: number) => {
      signals.push(signal);
      return value * 2;
    });
    const { result } = renderHook(
      () => {
        const asyncTask = useAsyncTask(task);
        useLayoutEffect(() => {
          void asyncTask.run(3);
        }, [asyncTask.run]);
        return asyncTask;
      },
      { wrapper: StrictMode },
    );

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(task).toHaveBeenCalled();
    expect(result.current.state).toEqual({
      status: "success",
      data: 6,
      error: undefined,
    });
    if (signals.length > 1) {
      expect(signals[0]?.aborted).toBe(true);
    }
  });

  it("invokes tasks without a receiver and ignores late settlement", async () => {
    const pending = deferred<string>();
    let receiver: unknown = "not called";
    let signal: AbortSignal | undefined;
    const { result, unmount } = renderHook(() =>
      useAsyncTask(function (this: void, currentSignal) {
        receiver = this;
        signal = currentSignal;
        return pending.promise;
      }),
    );

    let run!: Promise<string>;
    act(() => {
      run = result.current.run();
    });
    const savedRun = result.current.run;
    expect(receiver).toBeUndefined();
    unmount();
    expect(signal?.aborted).toBe(true);

    pending.resolve("late");
    await expect(run).resolves.toBe("late");
    await expect(savedRun()).rejects.toThrow(
      "Cannot run a task after its hook has unmounted",
    );
  });
});
