/**
 * Creates a function that can only be called once. Subsequent calls to the function will return undefined.
 *
 * @param fn - The function to be called once.
 * @returns A new function that can only be called once.
 */
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
