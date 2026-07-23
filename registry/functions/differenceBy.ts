export type DifferenceBySelector<Source, Comparison, Key> = (
  this: void,
  value: Source | Comparison,
  index: number,
  array: readonly (Source | Comparison | undefined)[],
) => Key;

/** Returns values whose derived keys are absent from every other array. */
export const differenceBy = <const Source, Key, const Comparison = Source>(
  array: readonly Source[],
  others: ReadonlyArray<readonly Comparison[]>,
  getKey: DifferenceBySelector<Source, Comparison, Key>,
): Source[] => {
  const excluded = new Set<Key>();
  for (let otherIndex = 0; otherIndex < others.length; otherIndex += 1) {
    if (!Object.hasOwn(others, otherIndex)) continue;
    const other = others[otherIndex];
    if (!Array.isArray(other)) {
      throw new TypeError("others must contain only arrays");
    }
    for (let index = 0; index < other.length; index += 1) {
      if (!Object.hasOwn(other, index)) continue;
      excluded.add(getKey(other[index] as Comparison, index, other));
    }
  }
  const result: Source[] = [];
  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) continue;
    const value = array[index] as Source;
    if (!excluded.has(getKey(value, index, array))) result.push(value);
  }
  return result;
};
