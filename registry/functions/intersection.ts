/** Returns distinct values present in every provided array. */
export const intersection = <const T>(
  array: readonly T[],
  ...others: ReadonlyArray<readonly unknown[]>
): T[] => {
  const sets = others.map((other) => {
    if (!Array.isArray(other)) {
      throw new TypeError("comparison values must be arrays");
    }
    const set = new Set<unknown>();
    for (let index = 0; index < other.length; index += 1) {
      if (Object.hasOwn(other, index)) set.add(other[index]);
    }
    return set;
  });
  const seen = new Set<T>();
  const result: T[] = [];

  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) continue;
    const value = array[index] as T;
    if (seen.has(value) || !sets.every((set) => set.has(value))) continue;
    seen.add(value);
    result.push(value);
  }
  return result;
};
