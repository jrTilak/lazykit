export type SumBySelector<Value> = (
  this: void,
  value: Value,
  index: number,
  array: readonly (Value | undefined)[],
) => number;

/** Sums finite numbers produced by a selector. */
export const sumBy = <const T>(
  array: readonly T[],
  getValue: SumBySelector<T>,
): number => {
  let sum = 0;
  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) continue;
    const value = array[index] as T;
    const candidate = getValue(value, index, array);
    if (!Number.isFinite(candidate)) {
      throw new RangeError("selector must return finite numbers");
    }
    const nextSum = sum + candidate;
    if (!Number.isFinite(nextSum)) {
      throw new RangeError("sum must remain finite");
    }
    sum = nextSum;
  }
  return sum;
};
