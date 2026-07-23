import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type Callable = (...args: never[]) => unknown;

export type ObjectStateValue<State extends object> =
  State extends readonly unknown[] | Callable ? never : State;

export type ObjectStateAction<State extends object> =
  | State
  | ((this: void, state: Readonly<State>) => State);

export type ObjectStatePatch<State extends object> =
  | Partial<State>
  | ((this: void, state: Readonly<State>) => Partial<State>);

export interface UseObjectStateResult<State extends object> {
  readonly state: State;
  readonly setState: (action: ObjectStateAction<State>) => void;
  readonly patch: (patch: ObjectStatePatch<State>) => void;
  readonly setKey: <Key extends keyof State>(
    key: Key,
    value: State[Key],
  ) => void;
  readonly updateKey: <Key extends keyof State>(
    key: Key,
    updater: (this: void, value: State[Key]) => State[Key],
  ) => void;
  readonly reset: () => void;
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function isPlainObject(value: unknown): value is object {
  if (typeof value !== "object" || value === null) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertPlainObject(
  value: unknown,
  name: string,
): asserts value is object {
  if (!isPlainObject(value)) {
    throw new TypeError(`${name} must be a plain object`);
  }
}

function cloneObject<State extends object>(value: State): State {
  const clone = Object.create(Object.getPrototypeOf(value)) as State;
  for (const key of Reflect.ownKeys(value)) {
    Object.defineProperty(
      clone,
      key,
      Object.getOwnPropertyDescriptor(value, key) as PropertyDescriptor,
    );
  }
  return clone;
}

function descriptorsEqual(
  left: PropertyDescriptor | undefined,
  right: PropertyDescriptor,
): boolean {
  if (left === undefined) return false;
  if (
    left.configurable !== right.configurable ||
    left.enumerable !== right.enumerable
  ) {
    return false;
  }

  const leftIsData = Object.prototype.hasOwnProperty.call(left, "value");
  const rightIsData = Object.prototype.hasOwnProperty.call(right, "value");
  if (leftIsData !== rightIsData) return false;
  if (leftIsData) {
    return (
      left.writable === right.writable &&
      Object.is(left.value, right.value)
    );
  }

  return left.get === right.get && left.set === right.set;
}

function mergeOwnDescriptors<State extends object>(
  current: State,
  overrides: object,
): State {
  const descriptors = new Map<PropertyKey, PropertyDescriptor>();
  for (const key of Reflect.ownKeys(current)) {
    descriptors.set(
      key,
      Object.getOwnPropertyDescriptor(current, key) as PropertyDescriptor,
    );
  }
  for (const key of Reflect.ownKeys(overrides)) {
    descriptors.set(
      key,
      Object.getOwnPropertyDescriptor(overrides, key) as PropertyDescriptor,
    );
  }

  const next = Object.create(Object.getPrototypeOf(current)) as State;
  for (const [key, descriptor] of descriptors) {
    Object.defineProperty(next, key, descriptor);
  }
  return next;
}

function valueDescriptor(
  current: object,
  key: PropertyKey,
  value: unknown,
): PropertyDescriptor {
  const existing = Object.getOwnPropertyDescriptor(current, key);
  return {
    configurable: existing?.configurable ?? true,
    enumerable: existing?.enumerable ?? true,
    value,
    writable:
      existing !== undefined &&
      Object.prototype.hasOwnProperty.call(existing, "writable")
        ? (existing.writable ?? false)
        : true,
  };
}

function replaceOwnValue<State extends object>(
  current: State,
  key: PropertyKey,
  value: unknown,
): State {
  const override = Object.create(null) as object;
  Object.defineProperty(override, key, valueDescriptor(current, key, value));
  return mergeOwnDescriptors(current, override);
}

export function useObjectState<State extends object>(
  initialState: ObjectStateValue<State>,
): UseObjectStateResult<State>;
export function useObjectState<State extends object>(
  initialState: State,
): UseObjectStateResult<State> {
  assertPlainObject(initialState, "initialState");
  const resetSnapshot = cloneObject(initialState);
  const [state, setInternalState] = useState(() =>
    cloneObject(resetSnapshot),
  );
  const initialRef = useRef<State>(resetSnapshot);

  useIsomorphicLayoutEffect(() => {
    initialRef.current = resetSnapshot;
  });

  const setState = useCallback((action: ObjectStateAction<State>) => {
    setInternalState((current) => {
      const next =
        typeof action === "function"
          ? (action as (this: void, state: Readonly<State>) => State)(
              current,
            )
          : action;
      assertPlainObject(next, "state");
      return next === current ? current : cloneObject(next);
    });
  }, []);

  const patch = useCallback((action: ObjectStatePatch<State>) => {
    setInternalState((current) => {
      const partial =
        typeof action === "function" ? action(current) : action;
      assertPlainObject(partial, "patch");

      const changed = Reflect.ownKeys(partial).some(
        (key) =>
          !descriptorsEqual(
            Object.getOwnPropertyDescriptor(current, key),
            Object.getOwnPropertyDescriptor(
              partial,
              key,
            ) as PropertyDescriptor,
          ),
      );
      if (!changed) return current;

      return mergeOwnDescriptors(current, partial);
    });
  }, []);

  const setKey = useCallback(
    <Key extends keyof State>(key: Key, value: State[Key]) => {
      setInternalState((current) => {
        if (
          Object.prototype.hasOwnProperty.call(current, key) &&
          Object.is(current[key], value)
        ) {
          return current;
        }
        return replaceOwnValue(current, key, value);
      });
    },
    [],
  );

  const updateKey = useCallback(
    <Key extends keyof State>(
      key: Key,
      updater: (this: void, value: State[Key]) => State[Key],
    ) => {
      setInternalState((current) => {
        const currentValue = current[key];
        const nextValue = updater(currentValue);
        if (Object.is(currentValue, nextValue)) return current;
        return replaceOwnValue(current, key, nextValue);
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setInternalState(cloneObject(initialRef.current));
  }, []);

  return { state, setState, patch, setKey, updateKey, reset };
}
