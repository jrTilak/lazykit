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

/** Copies a plain object's own properties except for the selected keys. */
export const omit = <T extends object, K extends keyof T>(
  object: PlainObjectInput<T>,
  keys: readonly K[]
): Omit<T, K> => {
  const prototype = Object.getPrototypeOf(object) as object | null;
  if (
    Array.isArray(object) ||
    (prototype !== null && prototype !== Object.prototype)
  ) {
    throw new TypeError("object must be a plain object");
  }
  assertDense(keys, "keys");

  const result = Object.create(prototype) as Omit<T, K>;
  const properties = Reflect.ownKeys(object).flatMap((key) => {
    const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
    return descriptor ? [{ key, descriptor }] : [];
  });
  const entries = properties.map(({ key, descriptor }) => ({
    key,
    enumerable: descriptor.enumerable === true,
    value: readDescriptorValue(descriptor, object),
  }));
  for (const { key, value, enumerable } of entries) {
    Object.defineProperty(result, key, {
      value,
      enumerable,
      configurable: true,
      writable: true,
    });
  }
  for (const key of keys) Reflect.deleteProperty(result, key);
  return result;
};
