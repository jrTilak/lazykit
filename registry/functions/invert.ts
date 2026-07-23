/** Converts TypeScript's numeric object keys to their JavaScript runtime form. */
export type InvertedRuntimeKey<Key extends PropertyKey> = Key extends number
  ? number extends Key
    ? string
    : `${Key}`
  : Key;

type InvertedKeysForValue<
  Source extends object,
  Value extends PropertyKey,
> = {
  [Key in keyof Source]-?: Value extends Source[Key]
    ? InvertedRuntimeKey<Extract<Key, PropertyKey>>
    : never;
}[keyof Source];

/**
 * Every output key is optional because source properties can be
 * non-enumerable. When values collide, the value type contains the source keys
 * that can win.
 */
export type InvertResult<Source extends object> = {
  [Value in Extract<Source[keyof Source], PropertyKey>]?: InvertedKeysForValue<
    Source,
    Value
  >;
};

export type InvertInput<Source extends object> = {
  readonly [Key in keyof Source]: {} extends Pick<Source, Key>
    ? Required<Pick<Source, Key>>[Key] extends PropertyKey
      ? Source[Key]
      : never
    : Source[Key] extends PropertyKey
      ? Source[Key]
      : never;
};

const readDescriptorValue = (
  descriptor: PropertyDescriptor,
  receiver: object
): unknown => {
  if (Object.hasOwn(descriptor, "value")) return descriptor.value;
  return descriptor.get
    ? Reflect.apply(descriptor.get, receiver, [])
    : undefined;
};

/** Exchanges an object's own enumerable keys and property-key values. */
export const invert = <const Source extends object>(
  object: Source & InvertInput<Source>
): InvertResult<Source> => {
  const result = Object.create(null) as InvertResult<Source>;
  const properties = Reflect.ownKeys(object).flatMap((key) => {
    const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
    return descriptor ? [{ key, descriptor }] : [];
  });
  const entries = properties
    .filter(({ descriptor }) => descriptor.enumerable)
    .map(({ key, descriptor }) => ({
      key,
      value: readDescriptorValue(descriptor, object),
    }));

  for (const { key, value } of entries) {
    if (
      typeof value !== "string" &&
      typeof value !== "number" &&
      typeof value !== "symbol"
    ) {
      throw new TypeError(
        "invert expects every enumerable value to be a property key"
      );
    }
    Reflect.set(result, value, key);
  }
  return result;
};
