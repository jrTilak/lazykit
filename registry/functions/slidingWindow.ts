/** Creates overlapping fixed-size windows from an array. */
export const slidingWindow = <const T>(
  array: readonly T[],
  size: number,
  step: number = 1,
): T[][] => {
  if (!Number.isSafeInteger(size) || size <= 0) {
    throw new RangeError("size must be a positive safe integer");
  }
  if (!Number.isSafeInteger(step) || step <= 0) {
    throw new RangeError("step must be a positive safe integer");
  }
  const values: T[] = [];
  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) {
      throw new TypeError("array must not contain empty slots");
    }
    values.push(array[index] as T);
  }

  const result: T[][] = [];
  for (let index = 0; index + size <= values.length; index += step) {
    result.push(values.slice(index, index + size));
  }
  return result;
};
