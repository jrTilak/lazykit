/**
 * Retries the given function a specified number of times with a delay between each retry.
 **/
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
