/** Returns the first value with the smallest finite derived number. */
export const minBy = <T>(
  array: readonly T[],
  getValue: (value: T, index: number) => number
): T | undefined => {
  let result: T | undefined;
  let minimum = Infinity;
  let hasResult = false;

  array.forEach((value, index) => {
    const candidate = getValue(value, index);
    if (!Number.isFinite(candidate)) return;
    if (!hasResult || candidate < minimum) {
      result = value;
      minimum = candidate;
      hasResult = true;
    }
  });
  return result;
};
