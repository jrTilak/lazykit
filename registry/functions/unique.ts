/** Removes duplicate values while preserving their first-seen order. */
export const unique = <const T>(array: readonly T[]): T[] => {
  const seen = new Set<T>();
  const result: T[] = [];
  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) continue;
    const value = array[index] as T;
    if (seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }
  return result;
};
