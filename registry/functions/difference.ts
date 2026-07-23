/** Returns values from the first array that are absent from every other array. */
export const difference = <const T>(
  array: readonly T[],
  ...others: ReadonlyArray<readonly unknown[]>
): T[] => {
  const excluded = new Set<unknown>();
  for (const other of others) {
    if (!Array.isArray(other)) {
      throw new TypeError("comparison values must be arrays");
    }
    for (let index = 0; index < other.length; index += 1) {
      if (Object.hasOwn(other, index)) excluded.add(other[index]);
    }
  }
  const result: T[] = [];
  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) continue;
    const value = array[index] as T;
    if (!excluded.has(value)) result.push(value);
  }
  return result;
};
