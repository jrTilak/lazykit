type CountedFunction<Arguments extends unknown[], Return> = ((
  ...args: Arguments
) => Return) & {
  getCallCount: () => number;
  resetCallCount: () => void;
};

/** Wraps a function and tracks how many times the wrapper is invoked. */
export const withCallCount = <Arguments extends unknown[], Return>(
  fn: (...args: Arguments) => Return
): CountedFunction<Arguments, Return> => {
  let callCount = 0;

  const wrapped = (...args: Arguments): Return => {
    callCount += 1;
    return fn(...args);
  };

  return Object.assign(wrapped, {
    getCallCount: () => callCount,
    resetCallCount: () => {
      callCount = 0;
    },
  });
};
