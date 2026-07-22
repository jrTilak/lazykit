/** Copies the selected properties from an object. */
export const pick = <T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  for (const key of keys) Reflect.set(result, key, object[key]);
  return result;
};
