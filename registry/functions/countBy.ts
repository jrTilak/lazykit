export type CountByKeySelector<Value, Key extends PropertyKey> = (
  this: void,
  value: Value,
  index: number
) => Key;

/**
 * Counts are optional because a selector's return type describes every key it
 * may produce, not a guarantee that every possible key occurs in the input.
 */
export type CountByResult<Key extends PropertyKey> = Partial<Record<Key, number>>;

/** Counts values by a derived property key. */
export const countBy = <Value, Key extends PropertyKey>(
  array: readonly Value[],
  getKey: CountByKeySelector<Value, Key>
): CountByResult<Key> => {
  const result = Object.create(null) as CountByResult<Key>;
  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) continue;
    const value = array[index] as Value;
    const key = getKey(value, index);
    const count = Reflect.get(result, key) as number | undefined;
    Reflect.set(result, key, (count ?? 0) + 1);
  }
  return result;
};
