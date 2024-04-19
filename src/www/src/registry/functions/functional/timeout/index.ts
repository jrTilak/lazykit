/**
 * Wraps a function with a timeout.
 * If the function does not complete within the specified time, the promise will be rejected.
 *
 * @template Return - The return type of the wrapped function.
 * @template Err - The error type that can be thrown by the wrapped function or the error callback.
 * @param {(...args: any[]) => Return} fn - The function to be wrapped.
 * @param {number} time - The timeout duration in milliseconds.
 * @param {(...args: any[]) => Err} [errCb] - Optional error callback function to handle timeout errors.
 * @returns {(...args: any[]) => Promise<Return>} - A wrapped function that returns a promise.
 */
const timeout = <Return, Err>(
  fn: (...args: any[]) => Return,
  time: number,
  errCb?: (...args: any[]) => Err
): ((...args: any[]) => Promise<Return>) => {
  return (...args: any[]) => {
    return new Promise<any>((resolve, reject) => {
      const timer = setTimeout(() => {
        if (errCb) reject(errCb(...args));
        else {
          reject(new Error("Function timed out"));
        }
      }, time);

      // Wrap fn call in Promise.resolve to handle both sync and async functions
      Promise.resolve(fn(...args))
        .then((result: Return) => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch((err: Err) => {
          clearTimeout(timer);
          reject(err);
        });
    });
  };
};

export default timeout;
