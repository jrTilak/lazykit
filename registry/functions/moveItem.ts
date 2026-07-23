/** Moves one array item to another index without mutating the input. */
export const moveItem = <const T>(
  array: readonly T[],
  fromIndex: number,
  toIndex: number,
): T[] => {
  if (!Number.isSafeInteger(fromIndex) || !Number.isSafeInteger(toIndex)) {
    throw new RangeError("indexes must be safe integers");
  }
  const result: T[] = [];
  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) {
      throw new TypeError("array must not contain empty slots");
    }
    result.push(array[index] as T);
  }
  const length = result.length;
  const from = fromIndex < 0 ? length + fromIndex : fromIndex;
  const to = toIndex < 0 ? length + toIndex : toIndex;
  if (from < 0 || from >= length || to < 0 || to >= length) {
    throw new RangeError("indexes must refer to existing items");
  }
  if (from === to) return result;

  const value = result[from] as T;
  result.splice(from, 1);
  result.splice(to, 0, value);
  return result;
};
