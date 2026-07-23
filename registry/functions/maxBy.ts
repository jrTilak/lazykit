export type MaxBySelector<Value> = (
  this: void,
  value: Value,
  index: number,
  array: readonly (Value | undefined)[],
) => number;

/** Returns the first value with the largest finite derived number. */
export const maxBy = <const T>(
  array: readonly T[],
  getValue: MaxBySelector<T>,
): T | undefined => {
  let result: T | undefined;
  let maximum = -Infinity;
  let hasResult = false;

  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) continue;
    const value = array[index] as T;
    const candidate = getValue(value, index, array);
    if (!Number.isFinite(candidate)) continue;
    if (!hasResult || candidate > maximum) {
      result = value;
      maximum = candidate;
      hasResult = true;
    }
  }
  return result;
};
