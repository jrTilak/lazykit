export type UnionBySelector<Value, Key> = (
  this: void,
  value: Value,
  index: number,
  array: readonly (Value | undefined)[],
) => Key;

export type UnionByValue<Arrays extends ReadonlyArray<readonly unknown[]>> =
  Arrays[number][number];

/** Combines arrays while keeping the first value for every derived key. */
export const unionBy = <
  const Arrays extends ReadonlyArray<readonly unknown[]>,
  Key,
>(
  arrays: Arrays,
  getKey: UnionBySelector<UnionByValue<Arrays>, Key>,
): Array<UnionByValue<Arrays>> => {
  const seen = new Set<Key>();
  const result: Array<UnionByValue<Arrays>> = [];

  for (let arrayIndex = 0; arrayIndex < arrays.length; arrayIndex += 1) {
    if (!Object.hasOwn(arrays, arrayIndex)) continue;
    const source = arrays[arrayIndex];
    if (!Array.isArray(source)) {
      throw new TypeError("arrays must contain only arrays");
    }
    const array = source as readonly UnionByValue<Arrays>[];
    for (let index = 0; index < array.length; index += 1) {
      if (!Object.hasOwn(array, index)) continue;
      const value = array[index] as UnionByValue<Arrays>;
      const key = getKey(value, index, array);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(value);
      }
    }
  }
  return result;
};
