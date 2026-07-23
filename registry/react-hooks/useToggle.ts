import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

type Callable = (...args: never[]) => unknown;

type NonCallable<Value> = Value extends Callable ? never : Value;

export type ToggleStateAction<Value> =
  | NonCallable<Value>
  | ((this: void, value: Value) => Value);

export interface UseToggleResult<First, Second> {
  readonly value: First | Second;
  readonly setValue: (
    action: ToggleStateAction<First | Second>,
  ) => void;
  readonly toggle: () => void;
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useToggle<const First, const Second>(
  first: First,
  second: Second,
): UseToggleResult<First, Second>;
export function useToggle<const First, const Second>(
  first: First,
  second: Second,
  initialValue: First | Second,
): UseToggleResult<First, Second>;
export function useToggle<First, Second>(
  first: First,
  second: Second,
  initialValue?: First | Second,
): UseToggleResult<First, Second> {
  const initial = arguments.length >= 3 ? initialValue : first;

  if (!Object.is(initial, first) && !Object.is(initial, second)) {
    throw new RangeError("initialValue must be one of the two toggle values");
  }

  const [value, setInternalValue] = useState<First | Second>(
    () => initial as First | Second,
  );
  const valueIsConfigured = Object.is(value, first) || Object.is(value, second);
  const currentValue = valueIsConfigured ? value : first;

  useIsomorphicLayoutEffect(() => {
    if (!valueIsConfigured) setInternalValue(() => first);
  }, [first, valueIsConfigured]);

  const setValue = useCallback(
    (action: ToggleStateAction<First | Second>) => {
      setInternalValue((current) => {
        const configuredCurrent =
          Object.is(current, first) || Object.is(current, second)
            ? current
            : first;
        const next =
          typeof action === "function"
            ? (action as (
                this: void,
                value: First | Second,
              ) => First | Second)(
                configuredCurrent,
              )
            : action;

        if (!Object.is(next, first) && !Object.is(next, second)) {
          throw new RangeError("value must be one of the two toggle values");
        }

        return next;
      });
    },
    [first, second],
  );

  const toggle = useCallback(() => {
    setInternalValue((current) => {
      const configuredCurrent =
        Object.is(current, first) || Object.is(current, second)
          ? current
          : first;
      return Object.is(configuredCurrent, first) ? second : first;
    });
  }, [first, second]);

  return { value: currentValue, setValue, toggle };
}
