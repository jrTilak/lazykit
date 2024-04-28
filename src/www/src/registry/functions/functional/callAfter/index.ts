/**
 * Creates a function that delays the execution of the provided function until it has been called a specified number of times.
 *
 * @param fn - The function to be called after a certain number of invocations.
 * @param count - The number of times the function needs to be called before it is executed.
 * @returns A new function that delays the execution of the provided function until it has been called a specified number of times.
 */
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
