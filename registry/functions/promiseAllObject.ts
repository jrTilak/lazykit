type AnyFunction = (...args: never[]) => unknown;

type HasCallableResolvedThen<Source extends object> =
  "then" extends keyof Source
    ? Extract<Awaited<Source["then"]>, AnyFunction> extends never
      ? false
      : true
    : false;

export type PromiseAllObjectInput<Source extends object> =
  Source extends readonly unknown[]
    ? never
    : Source extends AnyFunction
      ? never
      : HasCallableResolvedThen<Source> extends true
        ? never
        : Source;

export type PromiseAllObjectResult<Source extends object> =
  Source extends readonly unknown[]
    ? never
    : Source extends AnyFunction
      ? never
      : HasCallableResolvedThen<Source> extends true
        ? never
        : { -readonly [Key in keyof Source]: Awaited<Source[Key]> };

const objectConstructorSource = Function.prototype.toString.call(Object);

const isPlainObject = (value: object): boolean => {
  const prototype = Object.getPrototypeOf(value) as object | null;
  if (prototype === null) return true;

  const constructor = Object.getOwnPropertyDescriptor(
    prototype,
    "constructor"
  )?.value as unknown;
  return (
    typeof constructor === "function" &&
    Function.prototype.toString.call(constructor) === objectConstructorSource
  );
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

/**
 * Resolves every own property of a plain object while preserving its keys.
 *
 * Arrays, functions, and class instances are rejected instead of being
 * converted into a plain object with an incompatible type.
 */
export const promiseAllObject = async <const Source extends object>(
  object: PromiseAllObjectInput<Source>
): Promise<PromiseAllObjectResult<Source>> => {
  if (
    object === null ||
    typeof object !== "object" ||
    Array.isArray(object) ||
    !isPlainObject(object)
  ) {
    throw new TypeError("promiseAllObject expects a plain object");
  }
  const prototype = Object.getPrototypeOf(object) as object | null;

  const properties = Reflect.ownKeys(object).flatMap((key) => {
    const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
    return descriptor ? [{ key, descriptor }] : [];
  });
  const keys = properties.map(({ key }) => key);
  const unresolvedValues = properties.map(({ descriptor }) =>
    readDescriptorValue(descriptor, object)
  );
  const values = await Promise.all(unresolvedValues);
  const thenIndex = keys.indexOf("then");
  if (thenIndex !== -1 && typeof values[thenIndex] === "function") {
    throw new TypeError(
      "promiseAllObject cannot return an object with a callable then property"
    );
  }
  const result = Object.create(
    prototype
  ) as PromiseAllObjectResult<Source>;

  keys.forEach((key, index) => {
    Reflect.defineProperty(result, key, {
      value: values[index],
      enumerable: true,
      configurable: true,
      writable: true,
    });
  });

  return result;
};
