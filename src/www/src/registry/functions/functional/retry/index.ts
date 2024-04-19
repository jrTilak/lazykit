/**
 * Retries the given function a specified number of times with a delay between each retry.
 * @param fn The function to retry.
 * @param retries The number of times to retry the function. Default is 3.
 * @param delay The delay in milliseconds between each retry. Default is 1000ms (1 second).
 * @returns A Promise that resolves to the result of the function if it succeeds, or rejects with the last error if all retries fail.
 */
const retry = async <T>(
  fn: Function,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay);
    }
    throw error;
  }
};

export default retry;
