/** Returns distinct values present in every provided array. */
export const intersection = <T>(
  array: readonly T[],
  ...others: ReadonlyArray<readonly T[]>
): T[] => {
  if (others.length === 0) return [...new Set(array)];
  const sets = others.map((other) => new Set(other));
  return [...new Set(array)].filter((value) =>
    sets.every((set) => set.has(value))
  );
};
