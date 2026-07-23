/** Sums finite numbers produced by a selector. */
export const sumBy = <T>(
  array: readonly T[],
  getValue: (value: T, index: number) => number
): number => {
  return array.reduce((sum, value, index) => {
    const candidate = getValue(value, index);
    if (!Number.isFinite(candidate)) {
      throw new RangeError("selector must return finite numbers");
    }
    return sum + candidate;
  }, 0);
};
