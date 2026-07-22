/** Resolves after the requested delay. */
export const sleep = (delayMs: number): Promise<void> => {
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new RangeError("delayMs must be a finite, non-negative number");
  }
  return new Promise((resolve) => setTimeout(resolve, delayMs));
};
