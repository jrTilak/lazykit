/** Converts TypeScript numeric keys to the strings received at runtime. */
export type FilterObjectKey<T extends object> =
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

/** Keeps the own enumerable properties that satisfy a predicate. */
export const filterObject = <T extends object>(
  object: T extends readonly unknown[] ? never : T,
  predicate: (
    this: void,
    value: T[keyof T],
    key: FilterObjectKey<T>,
    object: T
  ) => boolean
): Partial<T> => {
  if (Array.isArray(object)) {
    throw new TypeError("object must not be an array");
  }
  const filtered = Object.create(null) as Partial<T>;

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
    if (predicate(value, key as FilterObjectKey<T>, object)) {
      Object.defineProperty(filtered, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    }
  }

  return filtered;
};
