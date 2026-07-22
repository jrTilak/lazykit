type OnceState<Return> =
  | { status: "idle" }
  | { status: "running" }
  | { status: "returned"; value: Return }
  | { status: "threw"; error: unknown };

/** Invokes a function once, then reuses its return value or thrown error. */
export const once = <Arguments extends unknown[], Return>(
  fn: (...args: Arguments) => Return
): ((...args: Arguments) => Return) => {
  let state: OnceState<Return> = { status: "idle" };

  return (...args: Arguments): Return => {
    if (state.status === "returned") return state.value;
    if (state.status === "threw") throw state.error;
    if (state.status === "running") {
      throw new Error("once callback cannot invoke itself recursively");
    }

    state = { status: "running" };
    try {
      const value = fn(...args);
      state = { status: "returned", value };
      return value;
    } catch (error) {
      state = { status: "threw", error };
      throw error;
    }
  };
};
