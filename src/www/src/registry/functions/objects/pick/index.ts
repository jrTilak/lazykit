/**
 * Picks the specified keys from an object.
 **/
const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const newObj: any = {};
  keys.forEach((key) => {
    newObj[key] = obj[key];
  });
  return newObj as Pick<T, K>;
};

export default pick;
