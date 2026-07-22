/** Copies an object without the selected own enumerable properties. */
export const omit = <T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Omit<T, K> => {
  const result = { ...object };
  for (const key of keys) Reflect.deleteProperty(result, key);
  return result;
};
