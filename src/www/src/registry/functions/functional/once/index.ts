const once = <T, S extends any[]>(
  fn: (...args: S) => T
): ((...args: S) => T | undefined) => {
  let isCalled = false;
  return (...args: S): T | undefined => {
    if (!isCalled) {
      isCalled = true;
      return fn(...args);
    }
    return undefined;
  };
};

export default once;
