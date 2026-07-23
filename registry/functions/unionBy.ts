/** Combines arrays while keeping the first value for every derived key. */
export const unionBy = <T, Key>(
  arrays: ReadonlyArray<readonly T[]>,
  getKey: (value: T) => Key
): T[] => {
  const seen = new Set<Key>();
  const result: T[] = [];

  for (const array of arrays) {
    for (const value of array) {
      const key = getKey(value);
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(value);
    }
  }
  return result;
};
