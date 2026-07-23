export type RetryOptions = {
  maxAttempts?: number;
  delayMs?: number;
  shouldRetry?: (
    this: void,
    error: unknown,
    failedAttempt: number
  ) => boolean | PromiseLike<boolean>;
};

/** Repeats a failing operation until it succeeds or reaches the attempt limit. */
export const retry = async <Return>(
  operation: (this: void, attempt: number) => Return,
  {
    maxAttempts = 3,
    delayMs = 0,
    shouldRetry,
  }: RetryOptions = {}
): Promise<Awaited<Return>> => {
  if (!Number.isSafeInteger(maxAttempts) || maxAttempts < 1) {
    throw new RangeError("maxAttempts must be a positive safe integer");
  }
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new RangeError("delayMs must be a finite, non-negative number");
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      const isLastAttempt = attempt === maxAttempts;
      if (isLastAttempt || (shouldRetry && !(await shouldRetry(error, attempt)))) {
        throw error;
      }
      if (delayMs > 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw new Error("retry reached an unreachable state");
};
