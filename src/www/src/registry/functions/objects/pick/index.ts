/**
 * Creates a new object with only the specified keys from the original object.
 *
 * @param obj - The original object.
 * @param keys - An array of keys to pick from the original object.
 * @returns A new object with only the specified keys.
 * @typeParam T - The type of the original object.
 * @typeParam K - The type of the keys to pick.
 */
const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const newObj: any = {};
  keys.forEach((key) => {
    newObj[key] = obj[key];
  });
  return newObj as Pick<T, K>;
};

export default pick;
