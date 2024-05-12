/**
 * Invokes the function passed with arguments and
 * counts how many times the function is executed.
 *
 * @param {Function} fn - The function to be called.
 * @returns          - result: the result of the passed function invocation.
 *                    This function also has a getCount method attached.
 * @returns {Function} getCount - A method that returns the count of execution of the passed function.
 */
const count = <A extends any[], R>(fn: (...args: A) => R) => {
  let callCount = 0;

  const wrapper = (...args: A): R => {
    callCount++;
    const result = fn(...args);
    return result;
  };

  const getCount: () => number = () => callCount;
  wrapper.getCount = getCount;

  return wrapper;
};

export default count;
