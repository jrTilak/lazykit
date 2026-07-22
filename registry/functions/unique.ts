/** Removes duplicate values while preserving their first-seen order. */
export const unique = <T>(array: readonly T[]): T[] => {
  return [...new Set(array)];
};
