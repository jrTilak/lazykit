/**
 * Renames keys in an object.
 **/
const renameKeys = <
  T extends Record<string, unknown>,
  K extends keyof T,
  N extends string,
>(
  obj: T,
  keys: Array<{ old: K; new: N }>
): Omit<T, K> & Record<N, T[K]> => {
  const newObj: Record<string, unknown> = { ...obj };

  keys.forEach(({ old: oldKey, new: newKey }) => {
    // Only rename if the old key exists in the object
    if (oldKey in newObj) {
      newObj[newKey] = newObj[oldKey as string];
      delete newObj[oldKey as string];
    }
  });

  return newObj as Omit<T, K> & Record<N, T[K]>;
};

export default renameKeys;
