/** Creates overlapping fixed-size windows from an array. */
export const slidingWindow = <T>(
  array: readonly T[],
  size: number,
  step: number = 1
): T[][] => {
  if (!Number.isSafeInteger(size) || size <= 0) {
    throw new RangeError("size must be a positive safe integer");
  }
  if (!Number.isSafeInteger(step) || step <= 0) {
    throw new RangeError("step must be a positive safe integer");
  }

  const result: T[][] = [];
  for (let index = 0; index + size <= array.length; index += step) {
    result.push(array.slice(index, index + size));
  }
  return result;
};
