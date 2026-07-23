export type UniqueBySelector<Value, Key> = (
  this: void,
  value: Value,
  index: number,
  array: readonly (Value | undefined)[],
) => Key;

/** Keeps the first value for every distinct derived key. */
export const uniqueBy = <const T, Key>(
  array: readonly T[],
  getKey: UniqueBySelector<T, Key>,
): T[] => {
  const seen = new Set<Key>();
  const result: T[] = [];
  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) continue;
    const value = array[index] as T;
    const key = getKey(value, index, array);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
};
