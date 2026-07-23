type KnownNonPlainObject =
  | readonly unknown[]
  | ((...args: never[]) => unknown)
  | (abstract new (...args: never[]) => unknown)
  | Date
  | RegExp
  | Error
  | PromiseLike<unknown>
  | ReadonlyMap<unknown, unknown>
  | ReadonlySet<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | ArrayBuffer
  | SharedArrayBuffer
  | ArrayBufferView;

type PlainObjectInput<T extends object> =
  T extends KnownNonPlainObject ? never : T;

type IsUnion<Value, Whole = Value> =
  Value extends unknown
    ? [Whole] extends [Value]
      ? false
      : true
    : never;
type IsSingletonPropertyKey<Value extends PropertyKey> =
  [Value] extends [never]
    ? false
    : IsUnion<Value> extends true
      ? false
      : {} extends Record<Value, never>
        ? false
        : true;
type HasDynamicKey<Keys extends readonly PropertyKey[]> =
  Keys extends readonly [
    infer Head extends PropertyKey,
    ...infer Tail extends readonly PropertyKey[],
  ]
    ? IsSingletonPropertyKey<Head> extends true
      ? HasDynamicKey<Tail>
      : true
    : false;
type IsExactKeyList<Keys extends readonly PropertyKey[]> =
  number extends Keys["length"]
    ? false
    : IsUnion<Keys["length"]> extends true
      ? false
      : HasDynamicKey<Keys> extends true
        ? false
        : true;

/** The properties a `pick` key list can guarantee are present. */
export type PickedObject<
  T,
  Keys extends readonly (keyof T)[],
> = IsExactKeyList<Keys> extends true
  ? Pick<T, Keys[number]>
  : Partial<Pick<T, Keys[number]>>;

const assertDense = (values: readonly unknown[], name: string): void => {
  for (let index = 0; index < values.length; index += 1) {
    if (!Object.hasOwn(values, index)) {
      throw new TypeError(`${name} must not contain empty slots`);
    }
  }
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

/** Copies selected properties from a plain object. */
export const pick = <
  T extends object,
  const Keys extends readonly (keyof T)[],
>(
  object: PlainObjectInput<T>,
  keys: Keys
): PickedObject<T, Keys> => {
  const prototype = Object.getPrototypeOf(object) as object | null;
  if (
    Array.isArray(object) ||
    (prototype !== null && prototype !== Object.prototype)
  ) {
    throw new TypeError("object must be a plain object");
  }
  assertDense(keys, "keys");

  const result = Object.create(prototype) as Partial<
    Pick<T, Keys[number]>
  >;
  const properties = keys.flatMap((key) => {
    const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
    return descriptor ? [{ key, descriptor }] : [];
  });
  const entries = properties.map(({ key, descriptor }) => ({
    key,
    value: readDescriptorValue(descriptor, object),
  }));
  for (const { key, value } of entries) {
    Object.defineProperty(result, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }
  return result as PickedObject<T, Keys>;
};
