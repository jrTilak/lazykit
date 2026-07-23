/** Returns values whose derived keys are absent from every other array. */
export const differenceBy = <T, Key>(
  array: readonly T[],
  others: ReadonlyArray<readonly T[]>,
  getKey: (value: T) => Key
): T[] => {
  const excluded = new Set<Key>();
  for (const other of others) {
    for (const value of other) excluded.add(getKey(value));
  }
  return array.filter((value) => !excluded.has(getKey(value)));
};
