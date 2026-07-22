/** Wraps a function and rejects when waiting for its result takes too long. */
export const withTimeout = <Arguments extends unknown[], Return>(
  fn: (...args: Arguments) => Return | PromiseLike<Return>,
  timeoutMs: number,
  createError: (...args: Arguments) => Error = () =>
    new Error(`Operation timed out after ${timeoutMs}ms`)
): ((...args: Arguments) => Promise<Awaited<Return>>) => {
  if (!Number.isFinite(timeoutMs) || timeoutMs < 0) {
    throw new RangeError("timeoutMs must be a finite, non-negative number");
  }

  return (...args: Arguments): Promise<Awaited<Return>> => {
    let timer: ReturnType<typeof setTimeout>;
    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        try {
          reject(createError(...args));
        } catch (error) {
          reject(error);
        }
      }, timeoutMs);
    });

    const operation = Promise.resolve().then(() => fn(...args));
    return Promise.race([operation, deadline]).finally(() => clearTimeout(timer));
  };
};
