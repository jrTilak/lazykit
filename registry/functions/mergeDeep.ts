type AtomicObject =
  | Date
  | RegExp
  | Error
  | Promise<unknown>
  | ReadonlyMap<unknown, unknown>
  | ReadonlySet<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | ArrayBuffer
  | ArrayBufferView;
type Simplify<T> = { [Key in keyof T]: T[Key] };
type RequiredKeys<T extends object> = {
  [Key in keyof T]-?: {} extends Pick<T, Key> ? never : Key;
}[keyof T];
type MergeKeys<Base extends object, Override extends object> =
  | keyof Base
  | keyof Override;
type IsKnownRecord<T> = T extends Record<PropertyKey, unknown> ? true : false;
type MergedProperty<
  Base extends object,
  Override extends object,
  Key extends PropertyKey,
> = Key extends keyof Override
  ? Key extends keyof Base
    ? {} extends Pick<Override, Key>
      ? Base[Key] | DeepMerge<Base[Key], Override[Key]>
      : DeepMerge<Base[Key], Override[Key]>
    : Override[Key]
  : Key extends keyof Base
    ? Base[Key]
    : never;
type MergeRecords<Base extends object, Override extends object> = Simplify<
  {
    [Key in Extract<
      MergeKeys<Base, Override>,
      RequiredKeys<Base> | RequiredKeys<Override>
    >]-?: MergedProperty<Base, Override, Key>;
  } & {
    [Key in Exclude<
      MergeKeys<Base, Override>,
      RequiredKeys<Base> | RequiredKeys<Override>
    >]?: MergedProperty<Base, Override, Key>;
  }
>;

/**
 * A recursive, override-wins merge type.
 *
 * Arrays, functions, built-ins, and non-record values use the override type.
 */
export type DeepMerge<Base, Override> =
  Override extends readonly unknown[]
    ? Override
    : Override extends (...arguments_: never[]) => unknown
      ? Override
      : Override extends AtomicObject
        ? Override
        : Base extends readonly unknown[]
          ? Override
          : Base extends (...arguments_: never[]) => unknown
            ? Override
            : Base extends AtomicObject
              ? Override
              : Base extends object
                ? Override extends object
                  ? IsKnownRecord<Base> extends true
                    ? IsKnownRecord<Override> extends true
                      ? MergeRecords<Base, Override>
                      : Override | MergeRecords<Base, Override>
                    : Override | MergeRecords<Base, Override>
                  : Override
                : Override;

const isPlainObject = (
  value: unknown
): value is Record<PropertyKey, unknown> => {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

type OwnPropertySnapshot = readonly [
  key: PropertyKey,
  descriptor: PropertyDescriptor,
];

const snapshotOwnProperties = (value: object): OwnPropertySnapshot[] => {
  const descriptors = Object.getOwnPropertyDescriptors(value);
  return Reflect.ownKeys(descriptors).map((key) => [
    key,
    Reflect.get(descriptors, key) as PropertyDescriptor,
  ]);
};

const readSnapshot = (
  receiver: object,
  descriptor: PropertyDescriptor
): unknown =>
  "value" in descriptor ? descriptor.value : descriptor.get?.call(receiver);

const defineClonedProperty = (
  object: object,
  key: PropertyKey,
  descriptor: PropertyDescriptor,
  value: unknown
): void => {
  Object.defineProperty(object, key, {
    value,
    enumerable: descriptor.enumerable ?? false,
    configurable: descriptor.configurable ?? false,
    writable: "writable" in descriptor ? descriptor.writable : true,
  });
};

/** Recursively merges plain objects; arrays and other values are replaced. */
export const mergeDeep = <Base extends object, Override extends object>(
  base: Base,
  override: Override
): DeepMerge<Base, Override> => {
  const mergedPairs = new WeakMap<object, WeakMap<object, unknown>>();

  const clone = (
    value: unknown,
    context: Map<object, unknown>
  ): unknown => {
    if (value === null || typeof value !== "object") return value;

    const contextual = context.get(value);
    if (contextual !== undefined) return contextual;

    if (Array.isArray(value)) {
      const properties = snapshotOwnProperties(value);
      const result: unknown[] = [];
      context.set(value, result);
      for (const [key, descriptor] of properties) {
        defineClonedProperty(
          result,
          key,
          descriptor,
          clone(readSnapshot(value, descriptor), context)
        );
      }
      return result;
    }

    if (!isPlainObject(value)) return value;

    const result: Record<PropertyKey, unknown> = Object.create(
      Object.getPrototypeOf(value)
    );
    const properties = snapshotOwnProperties(value);
    context.set(value, result);
    for (const [key, descriptor] of properties) {
      defineClonedProperty(
        result,
        key,
        descriptor,
        clone(readSnapshot(value, descriptor), context)
      );
    }
    return result;
  };

  const merge = (
    left: unknown,
    right: unknown,
    context: Map<object, unknown>
  ): unknown => {
    if (!isPlainObject(left) || !isPlainObject(right)) {
      return clone(right, context);
    }

    const cached = mergedPairs.get(left)?.get(right);
    if (cached !== undefined) return cached;

    const result: Record<PropertyKey, unknown> = Object.create(
      Object.getPrototypeOf(left)
    );
    let rightPairs = mergedPairs.get(left);
    if (rightPairs === undefined) {
      rightPairs = new WeakMap<object, unknown>();
      mergedPairs.set(left, rightPairs);
    }
    rightPairs.set(right, result);

    const pairContext = new Map(context);
    pairContext.set(left, result);
    pairContext.set(right, result);

    const leftProperties = snapshotOwnProperties(left);
    const rightProperties = snapshotOwnProperties(right);
    const leftDescriptors = new Map(leftProperties);
    const rightDescriptors = new Map(rightProperties);

    for (const [key, descriptor] of leftProperties) {
      if (!rightDescriptors.has(key)) {
        defineClonedProperty(
          result,
          key,
          descriptor,
          clone(readSnapshot(left, descriptor), pairContext)
        );
      }
    }

    for (const [key, descriptor] of rightProperties) {
      const leftDescriptor = leftDescriptors.get(key);
      const leftValue = leftDescriptor === undefined
        ? undefined
        : readSnapshot(left, leftDescriptor);
      defineClonedProperty(
        result,
        key,
        descriptor,
        merge(leftValue, readSnapshot(right, descriptor), pairContext)
      );
    }

    return result;
  };

  return merge(base, override, new Map()) as DeepMerge<Base, Override>;
};
