export type Falsy = false | 0 | 0n | "" | null | undefined;

const isTruthy = <Value>(value: Value): value is Exclude<Value, Falsy> =>
  Boolean(value);

/** Returns a new array containing only truthy values. */
export const compact = <const T>(
  array: readonly T[],
): Array<Exclude<T, Falsy>> => {
  const result: Array<Exclude<T, Falsy>> = [];
  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) continue;
    const value = array[index] as T;
    if (isTruthy(value)) result.push(value);
  }
  return result;
};
