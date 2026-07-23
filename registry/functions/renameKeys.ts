/** A source and destination pair accepted by `renameKeys`. */
export type RenameMapping<T> = {
  from: keyof T;
  to: PropertyKey;
};

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

const runtimeKey = (key: PropertyKey): string | symbol =>
  typeof key === "symbol" ? key : String(key);

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

type MappingSourceValue<
  T,
  Mapping,
  Destination extends PropertyKey,
> = Mapping extends {
  from: infer Source extends keyof T;
  to: infer Target extends PropertyKey;
}
  ? Destination extends Target
    ? T[Source]
    : never
  : never;
type SourceKeys<T, Mappings extends readonly RenameMapping<T>[]> =
  Mappings[number]["from"];
type DestinationKeys<
  T,
  Mappings extends readonly RenameMapping<T>[],
> = Mappings[number]["to"];
type IsRequiredKey<T, Key extends keyof T> =
  {} extends Pick<T, Key> ? false : true;
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
type RequiredMappedDestination<
  T,
  Mapping,
> = true extends IsUnion<Mapping>
  ? never
  : [Mapping] extends [
        {
          from: infer Source extends keyof T;
          to: infer Destination extends PropertyKey;
        },
      ]
    ? true extends IsUnion<Source>
      ? never
      : true extends IsUnion<Destination>
        ? never
        : IsSingletonPropertyKey<Destination> extends true
          ? IsRequiredKey<T, Source> extends true
            ? Source extends keyof Object
              ? never
              : Destination
            : never
          : never
    : never;
type RequiredMappedDestinations<
  T,
  Mappings extends readonly RenameMapping<T>[],
> = Mappings extends readonly [
  infer First,
  ...infer Rest extends readonly RenameMapping<T>[],
]
  ? RequiredMappedDestination<T, First> |
      RequiredMappedDestinations<T, Rest>
  : never;
type GuaranteedSourceKey<T, Mapping> =
  true extends IsUnion<Mapping>
    ? never
    : [Mapping] extends [{ from: infer Source extends keyof T }]
      ? true extends IsUnion<Source>
        ? never
        : Source
      : never;
type GuaranteedSourceKeys<
  T,
  Mappings extends readonly RenameMapping<T>[],
> = Mappings extends readonly [
  infer First,
  ...infer Rest extends readonly RenameMapping<T>[],
]
  ? GuaranteedSourceKey<T, First> | GuaranteedSourceKeys<T, Rest>
  : never;
type PreservedRequiredDestinations<
  T,
  Mappings extends readonly RenameMapping<T>[],
> = {
  [Destination in DestinationKeys<T, Mappings>]: Destination extends SourceKeys<
    T,
    Mappings
  >
    ? never
    : Destination extends keyof T
      ? IsRequiredKey<T, Destination> extends true
        ? Destination
        : never
      : never;
}[DestinationKeys<T, Mappings>];
type RequiredDestinations<
  T,
  Mappings extends readonly RenameMapping<T>[],
> =
  | RequiredMappedDestinations<T, Mappings>
  | PreservedRequiredDestinations<T, Mappings>;
type DestinationValue<
  T,
  Mappings extends readonly RenameMapping<T>[],
  Destination extends PropertyKey,
> =
  | MappingSourceValue<T, Mappings[number], Destination>
  | (Destination extends
      | GuaranteedSourceKeys<T, Mappings>
      | RequiredMappedDestinations<T, Mappings>
      ? never
      : Destination extends keyof T
        ? T[Destination]
        : never);
type Simplify<T> = { [Key in keyof T]: T[Key] };

type ExactRenamedObject<
  T,
  Mappings extends readonly RenameMapping<T>[],
> = Simplify<
  Omit<
    T,
    | SourceKeys<T, Mappings>
    | Extract<DestinationKeys<T, Mappings>, keyof T>
  > &
    Partial<
      Pick<
        T,
        Exclude<SourceKeys<T, Mappings>, GuaranteedSourceKeys<T, Mappings>>
      >
    > & {
      [Destination in RequiredDestinations<
        T,
        Mappings
      >]: DestinationValue<T, Mappings, Destination>;
    } & {
      [Destination in Exclude<
        DestinationKeys<T, Mappings>,
        RequiredDestinations<T, Mappings>
      >]?: DestinationValue<T, Mappings, Destination>;
    }
>;

type DynamicRenamedObject<T> =
  Simplify<Partial<T>> & Record<PropertyKey, unknown>;
type HasDynamicDestinationMember<Destination extends PropertyKey> =
  Destination extends unknown
    ? IsSingletonPropertyKey<Destination> extends true
      ? false
      : true
    : never;
type HasDynamicDestination<
  T,
  Mappings extends readonly RenameMapping<T>[],
> = Mappings extends readonly [
  infer First extends RenameMapping<T>,
  ...infer Rest extends readonly RenameMapping<T>[],
]
  ? true extends HasDynamicDestinationMember<First["to"]>
    ? true
    : HasDynamicDestination<T, Rest>
  : false;

/** The result of simultaneously applying a list of key renames. */
export type RenamedObject<
  T,
  Mappings extends readonly RenameMapping<T>[],
> = number extends Mappings["length"]
  ? DynamicRenamedObject<T>
  : IsUnion<Mappings["length"]> extends true
    ? DynamicRenamedObject<T>
    : HasDynamicDestination<T, Mappings> extends true
    ? DynamicRenamedObject<T>
    : ExactRenamedObject<T, Mappings>;

/** Copies a plain object and simultaneously renames selected own properties. */
export const renameKeys = <
  T extends object,
  const Mappings extends readonly RenameMapping<T>[],
>(
  object: PlainObjectInput<T>,
  mappings: Mappings
): RenamedObject<T, Mappings> => {
  const prototype = Object.getPrototypeOf(object) as object | null;
  if (
    Array.isArray(object) ||
    (prototype !== null && prototype !== Object.prototype)
  ) {
    throw new TypeError("object must be a plain object");
  }
  assertDense(mappings, "mappings");

  const renamed = Object.create(prototype) as Record<PropertyKey, unknown>;
  const snapshot = new Map<
    string | symbol,
    { value: unknown; enumerable: boolean }
  >();
  const properties = Reflect.ownKeys(object).flatMap((key) => {
    const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
    return descriptor ? [{ key, descriptor }] : [];
  });
  const entries = properties.map(({ key, descriptor }) => ({
    key,
    value: readDescriptorValue(descriptor, object),
    enumerable: descriptor.enumerable === true,
  }));
  for (const { key, value, enumerable } of entries) {
    const property = {
      value,
      enumerable,
    };
    snapshot.set(key, property);
    Object.defineProperty(renamed, key, {
      value: property.value,
      enumerable: property.enumerable,
      configurable: true,
      writable: true,
    });
  }

  const existing = mappings.flatMap(({ from, to }) => {
    const sourceKey = runtimeKey(from);
    const property = snapshot.get(sourceKey);
    if (!property) return [];
    return [{ from: sourceKey, to, ...property }];
  });

  for (const { from } of existing) Reflect.deleteProperty(renamed, from);
  for (const { to, value, enumerable } of existing) {
    Object.defineProperty(renamed, to, {
      value,
      enumerable,
      configurable: true,
      writable: true,
    });
  }

  return renamed as RenamedObject<T, Mappings>;
};
