type Nullish = null | undefined;
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

type IsAny<T> = 0 extends 1 & T ? true : false;
type IsAlwaysNullish<T> = [Exclude<T, Nullish>] extends [never] ? true : false;
type MayBeNullish<T> = IsAny<T> extends true
  ? true
  : [null] extends [T]
    ? true
    : [undefined] extends [T]
      ? true
      : false;
type Simplify<T> = { [Key in keyof T]: T[Key] };
type ArrayExtraKeys<T extends readonly unknown[]> = Exclude<
  keyof T,
  keyof readonly unknown[] | number | `${number}`
>;

type CompactProperties<T extends object> = Simplify<
  {
    [Key in keyof T as IsAlwaysNullish<T[Key]> extends true
      ? never
      : MayBeNullish<T[Key]> extends true
        ? never
        : Key]: CompactResult<Exclude<T[Key], Nullish>>;
  } & {
    [Key in keyof T as IsAlwaysNullish<T[Key]> extends true
      ? never
      : MayBeNullish<T[Key]> extends true
        ? Key
        : never]?: CompactResult<Exclude<T[Key], Nullish>>;
  }
>;
type CompactArray<T extends readonly unknown[]> = Array<
  CompactResult<Exclude<T[number], Nullish>>
> &
  CompactProperties<Pick<T, ArrayExtraKeys<T>>>;

/**
 * The recursively compacted form of a value.
 *
 * Nullish-only properties disappear, possibly nullish properties become
 * optional, and nullish array members are removed.
 */
export type CompactResult<T> = T extends Nullish
  ? never
  : T extends (...arguments_: never[]) => unknown
    ? T
    : T extends readonly unknown[]
      ? CompactArray<T>
      : T extends AtomicObject
        ? T
        : T extends object
          ? T extends Record<PropertyKey, unknown>
            ? CompactProperties<T>
            : T | CompactProperties<T>
          : T;

const isArrayIndex = (key: PropertyKey): boolean => {
  if (typeof key !== "string" || !/^(0|[1-9]\d*)$/.test(key)) return false;
  const index = Number(key);
  return Number.isSafeInteger(index) && index < 4_294_967_295;
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

const snapshotOwnValues = (object: object) => {
  const properties = Reflect.ownKeys(object).flatMap((key) => {
    const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
    return descriptor ? [{ key, descriptor }] : [];
  });
  return properties.map(({ key, descriptor }) => ({
    key,
    value: readDescriptorValue(descriptor, object),
    enumerable: descriptor.enumerable === true,
  }));
};

const compactValue = (value: unknown, seen: WeakMap<object, unknown>): unknown => {
  if (value == null || typeof value !== "object") return value;
  const prototype = Object.getPrototypeOf(value);
  if (!Array.isArray(value) && prototype !== Object.prototype && prototype !== null) return value;
  const cached = seen.get(value);
  if (cached !== undefined) return cached;

  if (Array.isArray(value)) {
    const result: unknown[] = [];
    seen.set(value, result);
    const entries = snapshotOwnValues(value);
    const indexedEntries = entries
      .filter(({ key }) => isArrayIndex(key))
      .sort((left, right) => Number(left.key) - Number(right.key));
    for (const { value: item } of indexedEntries) {
      if (item != null) result.push(compactValue(item, seen));
    }
    for (const { key, value: item, enumerable } of entries) {
      if (
        key === "length" ||
        isArrayIndex(key)
      ) {
        continue;
      }
      if (item != null) {
        Object.defineProperty(result, key, {
          value: compactValue(item, seen),
          enumerable,
          configurable: true,
          writable: true,
        });
      }
    }
    return result;
  }

  const result: Record<PropertyKey, unknown> = Object.create(prototype);
  seen.set(value, result);
  const entries = snapshotOwnValues(value);
  for (const { key, value: item, enumerable } of entries) {
    if (item != null) {
      Reflect.defineProperty(result, key, {
        value: compactValue(item, seen),
        enumerable,
        configurable: true,
        writable: true,
      });
    }
  }
  return result;
};

/** Recursively removes null and undefined own properties and array entries. */
export const compactObject = <T extends object>(object: T): CompactResult<T> => {
  return compactValue(object, new WeakMap()) as CompactResult<T>;
};
