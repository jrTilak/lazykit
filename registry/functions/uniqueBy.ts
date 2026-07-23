/** Keeps the first value for every distinct derived key. */
export const uniqueBy = <T, Key>(
  array: readonly T[],
  getKey: (value: T, index: number) => Key
): T[] => {
  const seen = new Set<Key>();
  return array.filter((value, index) => {
    const key = getKey(value, index);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
