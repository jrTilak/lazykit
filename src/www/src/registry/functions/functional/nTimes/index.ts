/**
 * Executes a given function `n` times and returns an array of the results.
 *
 * @template T - The type of the result returned by the function.
 * @param {Function} fn - The function to be executed `n` times.
 * @param {number} [n=1] - The number of times the function should be executed. Defaults to 1.
 * @returns {T[]} - An array of the results returned by the function.
 * @throws {Error} - If `n` is less than 0.
 */
const nTimes = <T>(fn: (i: number) => T, n: number = 1): T[] => {
  if (n < 0) {
    throw new Error("n must be greater than 0");
  }
  let result: T[] = [];
  for (let i = 0; i < n; i++) {
    result.push(fn(i));
  }
  return result;
};

export default nTimes;
