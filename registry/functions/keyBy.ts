/** Indexes values by a derived property key, with later values replacing earlier ones. */
export const keyBy = <T, Key extends PropertyKey>(
  array: readonly T[],
  getKey: (value: T, index: number) => Key
): Record<Key, T> => {
  const result = Object.create(null) as Record<Key, T>;
  array.forEach((value, index) => {
    Reflect.set(result, getKey(value, index), value);
  });
  return result;
};
