/** Transforms own enumerable object keys, with later collisions winning. */
export const mapKeys = <T extends object, Key extends PropertyKey>(
  object: T,
  transform: (value: T[keyof T], key: keyof T, object: T) => Key
): Record<Key, T[keyof T]> => {
  const result = Object.create(null) as Record<Key, T[keyof T]>;
  for (const key of Reflect.ownKeys(object) as Array<keyof T>) {
    if (!Object.prototype.propertyIsEnumerable.call(object, key)) continue;
    Reflect.set(result, transform(object[key], key, object), object[key]);
  }
  return result;
};
