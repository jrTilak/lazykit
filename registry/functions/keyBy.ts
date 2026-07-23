export type KeyByKeySelector<Value, Key extends PropertyKey> = (
  this: void,
  value: Value,
  index: number
) => Key;

/**
 * Indexed values are optional because a selector may not produce every key in
 * its return type for a particular input.
 */
export type KeyByResult<Value, Key extends PropertyKey> = Partial<
  Record<Key, Value>
>;

/** Indexes values by a derived property key, with later values replacing earlier ones. */
export const keyBy = <Value, Key extends PropertyKey>(
  array: readonly Value[],
  getKey: KeyByKeySelector<Value, Key>
): KeyByResult<Value, Key> => {
  const result = Object.create(null) as KeyByResult<Value, Key>;
  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) continue;
    const value = array[index] as Value;
    Reflect.set(result, getKey(value, index), value);
  }
  return result;
};
