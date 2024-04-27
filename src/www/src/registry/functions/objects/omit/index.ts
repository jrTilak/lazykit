/**
 * Creates a new object with the specified keys omitted.
 *
 * @param obj - The object from which to omit keys.
 * @param keys - An array of keys to omit from the object.
 * @returns A new object with the specified keys omitted.
 */
const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const newObj = { ...obj };
  keys.forEach((key) => delete newObj[key]);
  return newObj as Omit<T, K>;
};

export default omit;
