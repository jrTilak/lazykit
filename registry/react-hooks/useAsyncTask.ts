import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type AsyncTaskState<Result> =
  | {
      status: "idle";
      data: undefined;
      error: undefined;
    }
  | {
      status: "pending";
      data: undefined;
      error: undefined;
    }
  | {
      status: "success";
      data: Result;
      error: undefined;
    }
  | {
      status: "error";
      data: undefined;
      error: unknown;
    };

export type AsyncTask<Arguments extends unknown[], Result> = (
  this: void,
  signal: AbortSignal,
  ...args: Arguments
) => Result | PromiseLike<Result>;

export type UseAsyncTaskOptions = {
  abortPrevious?: boolean;
};

export type UseAsyncTaskReturn<Arguments extends unknown[], Result> = {
  state: AsyncTaskState<Result>;
  run: (this: void, ...args: Arguments) => Promise<Result>;
  abort: () => void;
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const idleState = (): AsyncTaskState<never> => ({
  status: "idle",
  data: undefined,
  error: undefined,
});

/**
 * Runs an abort-aware task on demand and exposes the state of its latest run.
 */
export const useAsyncTask = <Arguments extends unknown[], Result>(
  task: AsyncTask<Arguments, Result>,
  options: UseAsyncTaskOptions = {},
): UseAsyncTaskReturn<Arguments, Awaited<Result>> => {
  const [state, setState] = useState<AsyncTaskState<Awaited<Result>>>(
    idleState,
  );
  const taskRef = useRef(task);
  const abortPreviousRef = useRef(options.abortPrevious ?? true);
  const activeControllersRef = useRef(new Set<AbortController>());
  const runIdRef = useRef(0);
  const mountedRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    taskRef.current = task;
    abortPreviousRef.current = options.abortPrevious ?? true;
  }, [options.abortPrevious, task]);

  useIsomorphicLayoutEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      runIdRef.current += 1;
      const activeControllers = [...activeControllersRef.current];
      activeControllersRef.current.clear();
      for (const controller of activeControllers) {
        controller.abort();
      }
    };
  }, []);

  const abort = useCallback(() => {
    runIdRef.current += 1;
    const activeControllers = [...activeControllersRef.current];
    activeControllersRef.current.clear();
    if (mountedRef.current) setState(idleState);
    for (const controller of activeControllers) {
      controller.abort();
    }
  }, []);

  const run = useCallback(
    async (...args: Arguments): Promise<Awaited<Result>> => {
      if (!mountedRef.current) {
        throw new Error("Cannot run a task after its hook has unmounted");
      }

      if (abortPreviousRef.current) {
        const activeControllers = [...activeControllersRef.current];
        activeControllersRef.current.clear();
        for (const activeController of activeControllers) {
          activeController.abort();
        }
      }

      const controller = new AbortController();
      const runId = runIdRef.current + 1;
      runIdRef.current = runId;
      activeControllersRef.current.add(controller);

      if (mountedRef.current) {
        setState({
          status: "pending",
          data: undefined,
          error: undefined,
        });
      }

      try {
        const taskResult = Reflect.apply(taskRef.current, undefined, [
          controller.signal,
          ...args,
        ]) as Result | PromiseLike<Result>;
        const data = await taskResult;

        if (mountedRef.current && runIdRef.current === runId) {
          setState({
            status: "success",
            data,
            error: undefined,
          });
        }

        return data;
      } catch (error) {
        if (mountedRef.current && runIdRef.current === runId) {
          setState({
            status: "error",
            data: undefined,
            error,
          });
        }

        throw error;
      } finally {
        activeControllersRef.current.delete(controller);
      }
    },
    [],
  );

  return { state, run, abort };
};
