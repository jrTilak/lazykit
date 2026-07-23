/** Counts values by a derived property key. */
export const countBy = <T, Key extends PropertyKey>(
  array: readonly T[],
  getKey: (value: T, index: number) => Key
): Record<Key, number> => {
  const result = Object.create(null) as Record<Key, number>;
  array.forEach((value, index) => {
    const key = getKey(value, index);
    Reflect.set(result, key, (Reflect.get(result, key) as number | undefined ?? 0) + 1);
  });
  return result;
};
