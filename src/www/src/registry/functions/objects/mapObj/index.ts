/**
 * Same as Array.prototype.map, but for objects.
 **/
const mapObj = <T, U>(
  obj: Record<string, T>,
  callback: (value: T, key: string, obj: Record<string, T>) => U
): Record<string, U> => {
  const result: Record<string, U> = {};

  // loop through each key in the object
  for (const key in obj) {
    // check if the key is a property of the object
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = callback(obj[key], key, obj);
    }
  }

  return result;
};

export default mapObj;
