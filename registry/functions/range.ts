/** Generates numbers from start toward end, excluding end. */
export const range = (start: number, end: number, step?: number): number[] => {
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    throw new RangeError("start and end must be finite numbers");
  }
  const direction = end >= start ? 1 : -1;
  const resolvedStep = step ?? direction;
  if (!Number.isFinite(resolvedStep) || resolvedStep === 0) {
    throw new RangeError("step must be a finite non-zero number");
  }
  if (Math.sign(resolvedStep) !== direction && start !== end) {
    throw new RangeError("step must move from start toward end");
  }

  const length = Math.ceil((end - start) / resolvedStep);
  if (!Number.isSafeInteger(length) || length > 10_000_000) {
    throw new RangeError("range would contain too many values");
  }
  return Array.from({ length }, (_, index) => start + index * resolvedStep);
};
