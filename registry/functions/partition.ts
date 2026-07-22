/** Splits values into matching and non-matching groups. */
export const partition = <T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean
): [T[], T[]] => {
  const matches: T[] = [];
  const nonMatches: T[] = [];

  array.forEach((value, index) => {
    (predicate(value, index, array) ? matches : nonMatches).push(value);
  });

  return [matches, nonMatches];
};
