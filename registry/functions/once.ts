type OnceState<Return> =
  | { status: "idle" }
  | { status: "running" }
  | { status: "returned"; value: Return }
  | { status: "threw"; error: unknown };

export type OnceFunction<
  Arguments extends unknown[],
  Return,
  This = unknown,
> = (this: This, ...args: Arguments) => Return;

type AnyFunction = (this: never, ...args: never[]) => unknown;

/** Invokes a function once, then reuses its return value or thrown error. */
export const once = <Function extends AnyFunction>(
  fn: Function
): OnceFunction<
  Parameters<Function>,
  ReturnType<Function>,
  ThisParameterType<Function>
> => {
  let state: OnceState<ReturnType<Function>> = { status: "idle" };

  const wrapped = function (
    this: ThisParameterType<Function>,
    ...args: Parameters<Function>
  ): ReturnType<Function> {
    if (state.status === "returned") return state.value;
    if (state.status === "threw") throw state.error;
    if (state.status === "running") {
      throw new Error("once callback cannot invoke itself recursively");
    }

    state = { status: "running" };
    try {
      const value = Reflect.apply(fn, this, args) as ReturnType<Function>;
      state = { status: "returned", value };
      return value;
    } catch (error) {
      state = { status: "threw", error };
      throw error;
    }
  };

  return wrapped;
};
