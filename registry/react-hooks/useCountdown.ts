import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type UseCountdownOptions = {
  from: number;
  to?: number;
  step?: number;
  intervalMs?: number;
  autoStart?: boolean;
  loop?: boolean;
  onChange?: (this: void, value: number) => void;
  onComplete?: (this: void) => void;
};

export type UseCountdownReturn = {
  value: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Runs a controllable count-up or countdown between two finite values. */
export const useCountdown = ({
  from,
  to = 0,
  step = 1,
  intervalMs = 1_000,
  autoStart = false,
  loop = false,
  onChange,
  onComplete,
}: UseCountdownOptions): UseCountdownReturn => {
  if (!Number.isFinite(from) || !Number.isFinite(to)) {
    throw new RangeError("from and to must be finite numbers");
  }
  if (!Number.isFinite(step) || step <= 0) {
    throw new RangeError("step must be a finite, positive number");
  }
  if (!Number.isFinite(intervalMs) || intervalMs < 0) {
    throw new RangeError("intervalMs must be a finite, non-negative number");
  }

  const [value, setValue] = useState(from);
  const [isRunning, setIsRunning] = useState(autoStart && from !== to);
  const valueRef = useRef(from);
  const fromRef = useRef(from);
  const toRef = useRef(to);
  const stepRef = useRef(step);
  const loopRef = useRef(loop);
  const onChangeRef = useRef(onChange);
  const onCompleteRef = useRef(onComplete);

  useIsomorphicLayoutEffect(() => {
    fromRef.current = from;
    toRef.current = to;
    stepRef.current = step;
    loopRef.current = loop;
    onChangeRef.current = onChange;
    onCompleteRef.current = onComplete;
  }, [from, loop, onChange, onComplete, step, to]);

  useIsomorphicLayoutEffect(() => {
    valueRef.current = from;
    setValue(from);
    setIsRunning(autoStart && from !== to);
  }, [from, to]);

  useIsomorphicLayoutEffect(() => {
    if (!autoStart || fromRef.current === toRef.current) {
      setIsRunning(false);
      return;
    }

    if (valueRef.current === toRef.current) {
      valueRef.current = fromRef.current;
      setValue(fromRef.current);
    }
    setIsRunning(true);
  }, [autoStart]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      const current = valueRef.current;
      const target = toRef.current;

      if (current === target) {
        if (!loopRef.current) {
          setIsRunning(false);
          return;
        }

        const restarted = fromRef.current;
        valueRef.current = restarted;
        setValue(restarted);
        if (onChangeRef.current !== undefined) {
          Reflect.apply(onChangeRef.current, undefined, [restarted]);
        }
        return;
      }

      const direction = fromRef.current < target ? 1 : -1;
      const candidate = current + direction * stepRef.current;
      const next =
        direction === 1
          ? Math.min(candidate, target)
          : Math.max(candidate, target);

      valueRef.current = next;
      setValue(next);
      if (onChangeRef.current !== undefined) {
        Reflect.apply(onChangeRef.current, undefined, [next]);
      }

      if (next === target) {
        if (!loopRef.current) setIsRunning(false);
        if (onCompleteRef.current !== undefined) {
          Reflect.apply(onCompleteRef.current, undefined, []);
        }
      }
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [intervalMs, isRunning]);

  const start = useCallback(() => {
    if (fromRef.current === toRef.current) return;
    if (valueRef.current === toRef.current) {
      valueRef.current = fromRef.current;
      setValue(fromRef.current);
    }
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    valueRef.current = fromRef.current;
    setValue(fromRef.current);
    setIsRunning(false);
  }, []);

  return { value, isRunning, start, pause, reset };
};
