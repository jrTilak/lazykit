export type MinBySelector<Value> = (
  this: void,
  value: Value,
  index: number,
  array: readonly (Value | undefined)[],
) => number;

/** Returns the first value with the smallest finite derived number. */
export const minBy = <const T>(
  array: readonly T[],
  getValue: MinBySelector<T>,
): T | undefined => {
  let result: T | undefined;
  let minimum = Infinity;
  let hasResult = false;

  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) continue;
    const value = array[index] as T;
    const candidate = getValue(value, index, array);
    if (!Number.isFinite(candidate)) continue;
    if (!hasResult || candidate < minimum) {
      result = value;
      minimum = candidate;
      hasResult = true;
    }
  }
  return result;
};
