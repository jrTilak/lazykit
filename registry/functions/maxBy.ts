/** Returns the first value with the largest finite derived number. */
export const maxBy = <T>(
  array: readonly T[],
  getValue: (value: T, index: number) => number
): T | undefined => {
  let result: T | undefined;
  let maximum = -Infinity;
  let hasResult = false;

  array.forEach((value, index) => {
    const candidate = getValue(value, index);
    if (!Number.isFinite(candidate)) return;
    if (!hasResult || candidate > maximum) {
      result = value;
      maximum = candidate;
      hasResult = true;
    }
  });
  return result;
};
