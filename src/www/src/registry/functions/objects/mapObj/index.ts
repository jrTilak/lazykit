/**
 * Maps over the properties of an object and applies a callback function to each property.
 *
 * @template T - The type of the values in the input object.
 * @template U - The type of the values in the output object.
 * @param {Record<string, T>} obj - The input object.
 * @param {(value: T, key: string, obj: Record<string, T>) => U} callback - The callback function to apply to each property.
 * @returns {Record<string, U>} - The resulting object with the mapped properties.
 */
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
