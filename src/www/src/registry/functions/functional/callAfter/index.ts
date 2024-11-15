/**
 * Returns a new function that can be called only after calling a specific number of times.
 **/
const callAfter = <T, S extends any[]>(
  fn: (...args: S) => T,
  count: number
): ((...args: S) => T | undefined) => {
  let counter = 0;
  return (...args: S): T | undefined => {
    if (counter < count) {
      counter++;
      return undefined;
    }
    return fn(...args);
  };
};

export default callAfter;
