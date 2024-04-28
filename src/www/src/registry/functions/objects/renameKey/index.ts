/**
 * Renames a key in an object.
 *
 * @template T - The type of the object.
 * @template K - The type of the key to be renamed.
 * @template N - The type of the new key.
 * @param {T} obj - The object to modify.
 * @param {K} key - The key to be renamed.
 * @param {N} newKey - The new key name.
 * @returns {Omit<T, K> & { [P in N]: T[K] }} - The modified object with the renamed key.
 */
const renameKey = <T extends object, K extends keyof T, N extends string>(
  obj: T,
  key: K,
  newKey: N
): Omit<T, K> & {
  [P in N]: T[K];
} => {
  const newObj: any = { ...obj };
  newObj[newKey] = newObj[key];
  delete newObj[key];
  return newObj as Omit<T, K> & { [P in N]: T[K] };
};

export default renameKey;
