/** Converts TypeScript's numeric object keys to their JavaScript runtime form. */
export type RuntimeObjectKey<Key extends PropertyKey> = Key extends number
  ? number extends Key
    ? string
    : `${Key}`
  : Key;

export type MapKeysSourceKey<Source extends object> = RuntimeObjectKey<
  Extract<keyof Source, PropertyKey>
>;

export type MapKeysTransform<
  Source extends object,
  MappedKey extends PropertyKey,
> = (
  this: void,
  value: Source[keyof Source],
  key: MapKeysSourceKey<Source>,
  object: Source
) => MappedKey;

/**
 * Mapped properties are optional because a transform's return type describes
 * possible keys; collisions and the input's enumerable keys determine which
 * keys are actually present.
 */
export type MapKeysResult<
  Source extends object,
  MappedKey extends PropertyKey,
> = Partial<Record<MappedKey, Source[keyof Source]>>;

const readDescriptorValue = (
  descriptor: PropertyDescriptor,
  receiver: object
): unknown => {
  if (Object.hasOwn(descriptor, "value")) return descriptor.value;
  return descriptor.get
    ? Reflect.apply(descriptor.get, receiver, [])
    : undefined;
};

/** Transforms own enumerable object keys, with later collisions winning. */
export const mapKeys = <
  Source extends object,
  MappedKey extends PropertyKey,
>(
  object: Source,
  transform: MapKeysTransform<Source, MappedKey>
): MapKeysResult<Source, MappedKey> => {
  const result = Object.create(null) as MapKeysResult<Source, MappedKey>;
  const properties = Reflect.ownKeys(object).flatMap((key) => {
    const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
    return descriptor ? [{ key, descriptor }] : [];
  });
  const entries = properties
    .filter(({ descriptor }) => descriptor.enumerable)
    .map(({ key, descriptor }) => ({
      key,
      value: readDescriptorValue(descriptor, object) as Source[keyof Source],
    }));

  for (const { key, value } of entries) {
    Reflect.set(
      result,
      transform(value, key as MapKeysSourceKey<Source>, object),
      value
    );
  }
  return result;
};
