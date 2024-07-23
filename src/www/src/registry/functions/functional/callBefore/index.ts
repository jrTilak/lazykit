const callBefore = <T, S extends any[]>(
  fn: (...args: S) => T,
  count: number
): ((...args: S) => T | undefined) => {
  let counter = 0;
  return (...args: S): T | undefined => {
    if (counter < count) {
      counter++;
      return fn(...args);
    }
    return undefined;
  };
};

export default callBefore;
