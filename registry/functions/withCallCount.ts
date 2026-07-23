export type CallCountControls = {
  readonly getCallCount: () => number;
  readonly resetCallCount: () => void;
};

export type CountedFunction<
  Arguments extends unknown[],
  Return,
  This = unknown,
> = ((
  this: This,
  ...args: Arguments
) => Return) & CallCountControls;

type AnyFunction = (this: never, ...args: never[]) => unknown;
type CallCountGuard<Function extends AnyFunction> =
  Extract<keyof Function, keyof CallCountControls> extends never ? [] : never;

/** Wraps a function and tracks how many times the wrapper is invoked. */
export const withCallCount = <Function extends AnyFunction>(
  fn: Function,
  ..._guard: CallCountGuard<Function>
): Function & CallCountControls => {
  if ("getCallCount" in fn || "resetCallCount" in fn) {
    throw new TypeError(
      'fn must not define "getCallCount" or "resetCallCount" properties'
    );
  }

  let callCount = 0;

  const getCallCount = () => callCount;
  const resetCallCount = () => {
    callCount = 0;
  };

  return new Proxy(fn, {
    apply(target, receiver, args) {
      callCount += 1;
      return Reflect.apply(target, receiver, args);
    },
    get(target, property, receiver) {
      if (property === "getCallCount") return getCallCount;
      if (property === "resetCallCount") return resetCallCount;
      return Reflect.get(target, property, receiver);
    },
    has(target, property) {
      return (
        property === "getCallCount" ||
        property === "resetCallCount" ||
        Reflect.has(target, property)
      );
    },
    set(target, property, value, receiver) {
      return property === "getCallCount" || property === "resetCallCount"
        ? false
        : Reflect.set(target, property, value, receiver);
    },
  }) as Function & CallCountControls;
};
