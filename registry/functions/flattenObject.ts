type KnownNonPlainObject =
  | readonly unknown[]
  | Date
  | RegExp
  | Error
  | PromiseLike<unknown>
  | ReadonlyMap<unknown, unknown>
  | ReadonlySet<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | ((...arguments_: never[]) => unknown);

type UnsafeKey = "__proto__" | "prototype" | "constructor";
type KeyOf<T> = Extract<keyof T, string | number>;
type StringKey<Key extends PropertyKey> = Key extends string | number ? `${Key}` : never;
type Join<Prefix extends string, Key extends string> =
  Prefix extends "" ? Key : `${Prefix}.${Key}`;
type IsOptional<T, Key extends keyof T> = {} extends Pick<T, Key> ? true : false;
type Or<Left extends boolean, Right extends boolean> =
  Left extends true ? true : Right;
type IsUnion<T, Whole = T> =
  T extends Whole ? ([Whole] extends [T] ? false : true) : never;

type FlatEntry<Path extends string, Value, Optional extends boolean> = {
  path: Path;
  value: Value;
  optional: Optional;
};

type BroadFlatEntry = FlatEntry<string, unknown, true>;

type IsDefinitelyPlainObject<Value> =
  [Value] extends [object]
    ? [Value] extends [KnownNonPlainObject]
      ? false
      : [Value] extends [Readonly<Record<string, unknown>>]
        ? true
        : false
    : false;

type HasPlainObjectMember<Value> =
  [Exclude<Extract<Value, object>, KnownNonPlainObject>] extends [never]
    ? false
    : true;

type MakeFlatEntriesOptional<Entry> =
  Entry extends FlatEntry<infer Path, infer Value, boolean>
    ? FlatEntry<Path, Value, true>
    : never;

type FlattenValue<
  Value,
  Path extends string,
  Optional extends boolean,
  Depth extends readonly unknown[],
> =
  true extends IsUnion<Value>
    ? HasPlainObjectMember<Value> extends true
      ? BroadFlatEntry
      : FlatEntry<Path, Value, Optional>
    : [Value] extends [KnownNonPlainObject]
      ? FlatEntry<Path, Value, Optional>
      : IsDefinitelyPlainObject<Value> extends true
        ? KeyOf<Value> extends never
          ? FlatEntry<Path, Value, Optional>
          : FlattenEntries<Extract<Value, object>, Path, Optional, [...Depth, unknown]>
        : [Value] extends [object]
          ? KeyOf<Value> extends never
            ? FlatEntry<Path, Value, Optional>
            : | FlatEntry<Path, Value, true>
              | MakeFlatEntriesOptional<
                  FlattenEntries<
                    Extract<Value, object>,
                    Path,
                    true,
                    [...Depth, unknown]
                  >
                >
          : FlatEntry<Path, Value, Optional>;

type ValidateNestedFlattenValue<
  Value,
  Depth extends readonly unknown[],
> =
  true extends IsUnion<Value>
    ? true
    : [Value] extends [KnownNonPlainObject]
      ? true
      : [Value] extends [Readonly<Record<string, unknown>>]
        ? ValidateFlattenKeys<Extract<Value, object>, [...Depth, unknown]>
        : true;

type ValidateFlattenKeys<
  T extends object,
  Depth extends readonly unknown[] = [],
> =
  Depth["length"] extends 16
    ? true
    : string extends keyof T
      ? true
      : number extends keyof T
        ? true
        : Extract<keyof T, symbol> extends never
          ? false extends {
              [Key in KeyOf<T>]-?:
                StringKey<Key> extends UnsafeKey | `${string}.${string}`
                  ? false
                  : ValidateNestedFlattenValue<T[Key], Depth>;
            }[KeyOf<T>]
            ? false
            : true
          : false;

type FlattenEntries<
  T extends object,
  Prefix extends string = "",
  ParentOptional extends boolean = false,
  Depth extends readonly unknown[] = [],
> =
  Depth["length"] extends 16
    ? BroadFlatEntry
    : string extends keyof T
      ? BroadFlatEntry
      : number extends keyof T
        ? BroadFlatEntry
        : Extract<keyof T, symbol> extends never
          ? {
              [Key in KeyOf<T>]-?:
                StringKey<Key> extends infer Segment extends string
                  ? Segment extends UnsafeKey | `${string}.${string}`
                    ? BroadFlatEntry
                    : FlattenValue<
                        T[Key],
                        Join<Prefix, Segment>,
                        Or<ParentOptional, IsOptional<T, Key>>,
                        Depth
                      >
                  : never;
            }[KeyOf<T>]
          : BroadFlatEntry;

type EntryPath<Entry> = Entry extends FlatEntry<infer Path, unknown, boolean>
  ? Path
  : never;

type EntryValue<Entry, Path extends string> =
  Entry extends FlatEntry<Path, infer Value, boolean> ? Value : never;

type RequiredEntryPath<Entry> =
  Entry extends FlatEntry<infer Path, unknown, false> ? Path : never;

type OptionalEntryPath<Entry> =
  Entry extends FlatEntry<infer Path, unknown, true> ? Path : never;

type Simplify<T> = { [Key in keyof T]: T[Key] };

type ObjectFromFlatEntries<Entry> =
  [Entry] extends [never]
    ? Record<never, never>
    : string extends EntryPath<Entry>
      ? Record<string, unknown>
      : Simplify<
          {
            [Path in RequiredEntryPath<Entry>]: EntryValue<Entry, Path>;
          } & {
            [Path in OptionalEntryPath<Entry>]?: EntryValue<Entry, Path>;
          }
        >;

/** The dot-path mapping produced when a plain object is flattened. */
export type FlattenObjectResult<T extends object> =
  true extends IsUnion<T>
    ? Record<string, unknown>
    : ObjectFromFlatEntries<FlattenEntries<T>>;

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const blocked = new Set(["__proto__", "prototype", "constructor"]);

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
  descriptor: PropertyDescriptor,
): unknown =>
  "value" in descriptor ? descriptor.value : descriptor.get?.call(receiver);

/** Flattens nested plain-object properties into dot-delimited keys. */
export const flattenObject = <const T extends object>(
  object: T
    & (T extends KnownNonPlainObject ? never : unknown)
    & (ValidateFlattenKeys<T> extends true ? unknown : never)
): FlattenObjectResult<T> => {
  if (!isPlainObject(object)) {
    throw new TypeError("object must be a plain object");
  }

  const result: Record<string, unknown> = Object.create(null);
  const visit = (
    value: Record<string, unknown>,
    prefix: string,
    stack: WeakSet<object>
  ): void => {
    if (stack.has(value)) throw new TypeError("cannot flatten a circular object");
    const properties = snapshotOwnProperties(value);
    if (properties.some(([key]) => typeof key === "symbol")) {
      throw new TypeError("object contains an unsupported symbol key");
    }

    stack.add(value);
    if (properties.length === 0 && prefix) result[prefix] = {};

    for (const [key, descriptor] of properties) {
      if (typeof key !== "string") continue;
      if (key.includes(".") || blocked.has(key)) {
        throw new TypeError("object contains an ambiguous or unsafe key");
      }

      const path = prefix ? `${prefix}.${key}` : key;
      const child = readSnapshot(value, descriptor);
      if (isPlainObject(child)) visit(child, path, stack);
      else Reflect.set(result, path, child);
    }

    stack.delete(value);
  };

  visit(object, "", new WeakSet());
  return result as FlattenObjectResult<T>;
};
