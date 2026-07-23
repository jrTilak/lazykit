import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type Callable = (...args: never[]) => unknown;

type NonCallable<Value> = Value extends Callable ? never : Value;

export type ControllableStateAction<Value> =
  | NonCallable<Value>
  | ((this: void, value: Value) => Value);

export interface UseControllableStateOptions<Value> {
  readonly defaultValue: Value;
  readonly value?: Value;
  readonly onChange?: (this: void, value: Value) => void;
}

export interface UseControllableStateResult<Value> {
  readonly value: Value;
  readonly setValue: (action: ControllableStateAction<Value>) => void;
  readonly isControlled: boolean;
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useControllableState<Value>(
  options: UseControllableStateOptions<Value>,
): UseControllableStateResult<Value> {
  const isControlled = Object.prototype.hasOwnProperty.call(options, "value");
  const [uncontrolledValue, setUncontrolledValue] = useState<Value>(
    () => options.defaultValue,
  );
  const controlledRef = useRef(isControlled);
  const valueRef = useRef(
    isControlled ? (options.value as Value) : uncontrolledValue,
  );
  const onChangeRef = useRef(options.onChange);
  const value = isControlled
    ? (options.value as Value)
    : controlledRef.current
      ? valueRef.current
      : uncontrolledValue;

  useIsomorphicLayoutEffect(() => {
    if (controlledRef.current && !isControlled) {
      setUncontrolledValue(() => value);
    }
    valueRef.current = value;
    controlledRef.current = isControlled;
    onChangeRef.current = options.onChange;
  }, [isControlled, options.onChange, value]);

  const setValue = useCallback(
    (action: ControllableStateAction<Value>) => {
      const current = valueRef.current;
      const next =
        typeof action === "function"
          ? (action as (this: void, value: Value) => Value)(current)
          : action;

      if (Object.is(current, next)) return;

      if (!controlledRef.current) {
        valueRef.current = next;
        setUncontrolledValue(() => next);
      }
      const onChange = onChangeRef.current;
      if (onChange !== undefined) {
        Reflect.apply(onChange, undefined, [next]);
      }
    },
    [],
  );

  return { value, setValue, isControlled };
}
