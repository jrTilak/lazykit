/** Keeps the own enumerable properties that satisfy a predicate. */
export const filterObject = <T extends object>(
  object: T,
  predicate: (value: T[keyof T], key: keyof T, object: T) => boolean
): Partial<T> => {
  const filtered: Partial<T> = {};

  for (const key of Reflect.ownKeys(object) as Array<keyof T>) {
    if (!Object.prototype.propertyIsEnumerable.call(object, key)) continue;
    if (predicate(object[key], key, object)) {
      Reflect.set(filtered, key, object[key]);
    }
  }

  return filtered;
};
