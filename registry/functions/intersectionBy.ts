/** Returns the first distinct value for each derived key shared by all arrays. */
export const intersectionBy = <T, Key>(
  array: readonly T[],
  others: ReadonlyArray<readonly T[]>,
  getKey: (value: T) => Key
): T[] => {
  const sets = others.map(
    (other) => new Set(other.map((value) => getKey(value)))
  );
  const seen = new Set<Key>();

  return array.filter((value) => {
    const key = getKey(value);
    if (seen.has(key) || !sets.every((set) => set.has(key))) return false;
    seen.add(key);
    return true;
  });
};
