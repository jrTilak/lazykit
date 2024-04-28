/**
 * Calls the provided function `fn` only for the first `count` invocations,
 * and returns `undefined` for subsequent invocations.
 *
 * @template T - The return type of the function `fn`.
 * @template S - The argument types of the function `fn`.
 * @param {(...args: S) => T} fn - The function to be called.
 * @param {number} count - The number of times the function `fn` should be called.
 * @returns {(...args: S) => T | undefined} - A function that calls `fn` only for the first `count` invocations.
 */
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
