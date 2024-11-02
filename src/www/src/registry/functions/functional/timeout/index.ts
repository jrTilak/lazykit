/**
 * The timeout function wraps a function with a timeout. If the function does not complete within the specified time, the promise will be rejected.
 **/
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
