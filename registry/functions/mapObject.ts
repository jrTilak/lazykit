type MappedObject<T, Value> = {
  [Key in keyof T]: Value;
};

/** Transforms each own enumerable value while preserving its property key. */
export const mapObject = <T extends object, Value>(
  object: T,
  transform: (value: T[keyof T], key: keyof T, object: T) => Value
): MappedObject<T, Value> => {
  const mapped = {} as MappedObject<T, Value>;

  for (const key of Reflect.ownKeys(object) as Array<keyof T>) {
    if (!Object.prototype.propertyIsEnumerable.call(object, key)) continue;
    Reflect.set(mapped, key, transform(object[key], key, object));
  }

  return mapped;
};
