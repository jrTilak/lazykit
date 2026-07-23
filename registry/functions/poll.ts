export type PollOptions<Value> = {
  until: (
    this: void,
    value: Value,
    attempt: number
  ) => boolean | PromiseLike<boolean>;
  intervalMs?: number | ((this: void, attempt: number) => number);
  maxAttempts?: number;
  signal?: AbortSignal;
};

const abortError = (signal: AbortSignal): unknown => {
  if (signal.reason !== undefined) return signal.reason;
  const error = new Error("Operation aborted");
  error.name = "AbortError";
  return error;
};

const wait = (delayMs: number, signal?: AbortSignal): Promise<void> => {
  if (signal?.aborted) return Promise.reject(abortError(signal));
  return new Promise((resolve, reject) => {
    const timer = setTimeout(done, delayMs);
    function done() {
      signal?.removeEventListener("abort", aborted);
      resolve();
    }
    function aborted() {
      clearTimeout(timer);
      reject(abortError(signal as AbortSignal));
    }
    signal?.addEventListener("abort", aborted, { once: true });
  });
};

/** Repeats an operation until its result passes a condition or attempts are exhausted. */
export const poll = async <Return>(
  operation: (this: void, attempt: number) => Return,
  {
    until,
    intervalMs = 0,
    maxAttempts = Infinity,
    signal,
  }: PollOptions<NoInfer<Awaited<Return>>>
): Promise<Awaited<Return>> => {
  if (
    maxAttempts !== Infinity &&
    (!Number.isSafeInteger(maxAttempts) || maxAttempts < 1)
  ) {
    throw new RangeError("maxAttempts must be a positive safe integer or Infinity");
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (signal?.aborted) throw abortError(signal);
    const value = await operation(attempt);
    if (signal?.aborted) throw abortError(signal);
    const completed = await until(value, attempt);
    if (signal?.aborted) throw abortError(signal);
    if (completed) return value;
    if (attempt === maxAttempts) break;
    const delay = typeof intervalMs === "function" ? intervalMs(attempt) : intervalMs;
    if (!Number.isFinite(delay) || delay < 0) {
      throw new RangeError("interval must be finite and non-negative");
    }
    await wait(delay, signal);
  }

  throw new Error(`Polling condition was not met after ${maxAttempts} attempts`);
};
