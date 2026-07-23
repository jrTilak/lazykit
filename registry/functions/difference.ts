/** Returns values from the first array that are absent from every other array. */
export const difference = <T>(
  array: readonly T[],
  ...others: ReadonlyArray<readonly T[]>
): T[] => {
  const excluded = new Set(others.flat());
  return array.filter((value) => !excluded.has(value));
};
