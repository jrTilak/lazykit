export type IntersectionBySelector<Source, Comparison, Key> = (
  this: void,
  value: Source | Comparison,
  index: number,
  array: readonly (Source | Comparison | undefined)[],
) => Key;

/** Returns the first distinct value for each derived key shared by all arrays. */
export const intersectionBy = <const Source, Key, const Comparison = Source>(
  array: readonly Source[],
  others: ReadonlyArray<readonly Comparison[]>,
  getKey: IntersectionBySelector<Source, Comparison, Key>,
): Source[] => {
  const sets: Array<Set<Key>> = [];
  for (let otherIndex = 0; otherIndex < others.length; otherIndex += 1) {
    if (!Object.hasOwn(others, otherIndex)) continue;
    const other = others[otherIndex];
    if (!Array.isArray(other)) {
      throw new TypeError("others must contain only arrays");
    }
    const keys = new Set<Key>();
    for (let index = 0; index < other.length; index += 1) {
      if (!Object.hasOwn(other, index)) continue;
      keys.add(getKey(other[index] as Comparison, index, other));
    }
    sets.push(keys);
  }
  const seen = new Set<Key>();
  const result: Source[] = [];

  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) continue;
    const value = array[index] as Source;
    const key = getKey(value, index, array);
    if (seen.has(key) || !sets.every((set) => set.has(key))) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
};
