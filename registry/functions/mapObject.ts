/** An object whose property values have been replaced with `Value`. */
export type MappedObject<T, Value> = {
  [Key in keyof T]: Value;
};

/** Converts TypeScript numeric keys to the strings received at runtime. */
export type MapObjectKey<T extends object> =
  Extract<keyof T, PropertyKey> extends infer Key
    ? Key extends number
      ? number extends Key
        ? string
        : `${Key}`
      : Key
    : never;

const readDescriptorValue = (
  descriptor: PropertyDescriptor,
  receiver: object
): unknown => {
  if (Object.hasOwn(descriptor, "value")) return descriptor.value;
  return descriptor.get
    ? Reflect.apply(descriptor.get, receiver, [])
    : undefined;
};

/** Transforms each own enumerable value while preserving its property key. */
export const mapObject = <T extends object, Value>(
  object: T extends readonly unknown[] ? never : T,
  transform: (
    this: void,
    value: T[keyof T],
    key: MapObjectKey<T>,
    object: T
  ) => Value
): Partial<MappedObject<T, Value>> => {
  if (Array.isArray(object)) {
    throw new TypeError("object must not be an array");
  }
  const mapped = Object.create(null) as Partial<MappedObject<T, Value>>;

  const properties = Reflect.ownKeys(object).flatMap((key) => {
    const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
    return descriptor ? [{ key, descriptor }] : [];
  });
  const entries = properties
    .filter(({ descriptor }) => descriptor.enumerable)
    .map(({ key, descriptor }) => ({
      key,
      value: readDescriptorValue(descriptor, object) as T[keyof T],
    }));

  for (const { key, value } of entries) {
    Object.defineProperty(mapped, key, {
      value: transform(value, key as MapObjectKey<T>, object),
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }

  return mapped;
};
