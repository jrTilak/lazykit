/** A dot-delimited string or an explicit list of property keys. */
export type ObjectPath = string | readonly PropertyKey[];

type KnownNonContainer =
  | Date
  | RegExp
  | Error
  | Promise<unknown>
  | ReadonlyMap<unknown, unknown>
  | ReadonlySet<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | ArrayBuffer
  | SharedArrayBuffer
  | ArrayBufferView
  | ((...arguments_: never[]) => unknown)
  | (abstract new (...arguments_: never[]) => unknown);
type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type NonZeroDigit = Exclude<Digit, "0">;
type IsDigits<Text extends string> = Text extends ""
  ? true
  : Text extends `${Digit}${infer Rest}`
    ? IsDigits<Rest>
    : false;
type IsCanonicalArrayIndexText<Text extends string> = Text extends "0"
  ? true
  : Text extends `${NonZeroDigit}${infer Rest}`
    ? IsDigits<Rest>
    : false;
type DigitRank<Value extends Digit> = Value extends "0"
  ? []
  : Value extends "1"
    ? [0]
    : Value extends "2"
      ? [0, 0]
      : Value extends "3"
        ? [0, 0, 0]
        : Value extends "4"
          ? [0, 0, 0, 0]
          : Value extends "5"
            ? [0, 0, 0, 0, 0]
            : Value extends "6"
              ? [0, 0, 0, 0, 0, 0]
              : Value extends "7"
                ? [0, 0, 0, 0, 0, 0, 0]
                : Value extends "8"
                  ? [0, 0, 0, 0, 0, 0, 0, 0]
                  : [0, 0, 0, 0, 0, 0, 0, 0, 0];
type IsDigitLess<Left extends Digit, Right extends Digit> =
  DigitRank<Right> extends [...DigitRank<Left>, ...infer Rest]
    ? Rest extends []
      ? false
      : true
    : false;
type CompareLength<
  Left extends string,
  Right extends string,
> = Left extends `${Digit}${infer LeftRest}`
  ? Right extends `${Digit}${infer RightRest}`
    ? CompareLength<LeftRest, RightRest>
    : "greater"
  : Right extends `${Digit}${string}`
    ? "less"
    : "equal";
type IsLexicallyAtMost<
  Value extends string,
  Maximum extends string,
> = Value extends ""
  ? true
  : Value extends `${infer ValueHead extends Digit}${infer ValueTail}`
    ? Maximum extends `${infer MaximumHead extends Digit}${infer MaximumTail}`
      ? ValueHead extends MaximumHead
        ? IsLexicallyAtMost<ValueTail, MaximumTail>
        : IsDigitLess<ValueHead, MaximumHead>
      : false
    : false;
type IsAtMostMaximumArrayIndex<Text extends string> = CompareLength<
  Text,
  "4294967294"
> extends "less"
  ? true
  : CompareLength<Text, "4294967294"> extends "greater"
    ? false
    : IsLexicallyAtMost<Text, "4294967294">;
type IsArrayIndexText<Text extends string> =
  IsCanonicalArrayIndexText<Text> extends true
    ? IsAtMostMaximumArrayIndex<Text>
    : false;
type IsArrayIndexKey<Key> = Key extends number
  ? number extends Key
    ? false
    : IsArrayIndexText<`${Key}`>
  : Key extends string
    ? IsArrayIndexText<Key>
    : false;
type SplitPath<Path extends string> = Path extends ""
  ? []
  : Path extends `${infer Head}.${infer Tail}`
    ? [Head, ...SplitPath<Tail>]
    : [Path];
type PathSegments<Path extends ObjectPath> = Path extends string
  ? SplitPath<Path>
  : Path;
type IsUnion<Value, Whole = Value> = Value extends unknown
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
type IsDynamicSegment<Value extends PropertyKey> =
  IsSingletonPropertyKey<Value> extends true ? false : true;
type HasDynamicSegment<Segments extends readonly PropertyKey[]> =
  Segments extends readonly [
    infer Head extends PropertyKey,
    ...infer Tail extends PropertyKey[],
  ]
    ? IsDynamicSegment<Head> extends true
      ? true
      : HasDynamicSegment<Tail>
    : false;
type IsDynamicPath<Path extends ObjectPath> =
  IsUnion<Path> extends true
    ? true
    : [Path] extends [string]
      ? IsDynamicSegment<Extract<Path, string>>
      : [Path] extends [readonly PropertyKey[]]
        ? number extends Extract<Path, readonly PropertyKey[]>["length"]
          ? true
          : IsUnion<
                Extract<Path, readonly PropertyKey[]>["length"]
              > extends true
            ? true
            : HasDynamicSegment<Extract<Path, readonly PropertyKey[]>>
        : true;
type Simplify<T> = { [Key in keyof T]: T[Key] };
type IsAny<T> = 0 extends 1 & T ? true : false;

declare const missingPathValue: unique symbol;
type MissingPathValue = typeof missingPathValue;
type MatchingObjectKey<T extends object, Key> = Key extends keyof T
  ? Key
  : Key extends string
    ? Key extends `${infer NumberKey extends number}`
      ? `${NumberKey}` extends Key
        ? NumberKey extends keyof T
          ? NumberKey
          : never
        : never
      : never
    : Key extends number
      ? `${Key}` extends keyof T
        ? `${Key}`
        : never
      : never;
type PropertyAtBranch<T, Key> =
  NonNullable<T> extends readonly (infer Item)[]
    ? Key extends number
      ? number extends Key
        ? Item | MissingPathValue
        : IsArrayIndexKey<Key> extends true
          ? Item | MissingPathValue
          : MissingPathValue
      : IsArrayIndexKey<Key> extends true
        ? Item | MissingPathValue
        : MatchingObjectKey<NonNullable<T>, Key> extends infer Matched
          ? [Matched] extends [never]
            ? MissingPathValue
            : NonNullable<T>[Extract<Matched, keyof NonNullable<T>>]
          : MissingPathValue
    : NonNullable<T> extends object
      ? MatchingObjectKey<NonNullable<T>, Key> extends infer Matched
        ? [Matched] extends [never]
          ? MissingPathValue
          : NonNullable<T>[Extract<Matched, keyof NonNullable<T>>]
        : MissingPathValue
      : MissingPathValue;
type PropertyAt<T, Key> = T extends unknown
  ? PropertyAtBranch<T, Key>
  : never;
type ResolveSegments<T, Segments extends readonly PropertyKey[]> =
  Segments extends readonly [
    infer Head extends PropertyKey,
    ...infer Tail extends PropertyKey[],
  ]
    ? ResolveSegments<PropertyAt<T, Head>, Tail>
    : T;
type SetProperty<T, Key extends PropertyKey, Value> = T extends unknown
  ? T extends MissingPathValue | null | undefined
    ? IsArrayIndexKey<Key> extends true
      ? Array<Value>
      : { [Property in Key]: Value }
    : T extends readonly (infer Item)[]
      ? IsArrayIndexKey<Key> extends true
        ? Array<Item | Value>
        : Simplify<
            Omit<T, Extract<Key, keyof T>> & {
              [Property in Key]: Value;
            }
          >
      : T extends object
        ? Simplify<
            Omit<T, Extract<Key, keyof T>> & {
              [Property in Key]: Value;
            }
          >
        : IsArrayIndexKey<Key> extends true
          ? Array<Value>
          : { [Property in Key]: Value }
  : never;
type SetAtSegments<
  T,
  Segments extends readonly PropertyKey[],
  Value,
> = Segments extends readonly [
  infer Head extends PropertyKey,
  ...infer Tail extends PropertyKey[],
]
  ? Tail extends []
    ? SetProperty<T, Head, Value>
    : SetProperty<T, Head, SetAtSegments<PropertyAt<T, Head>, Tail, Value>>
  : never;
type ResolvedValue<T, Path extends ObjectPath> = ResolveSegments<
  T,
  PathSegments<Path>
>;
type IsDefinitelyKnownNonContainer<Value> = [
  IsAny<Value>,
] extends [true]
  ? false
  : [Exclude<Value, MissingPathValue | null | undefined>] extends [never]
    ? false
    : [
          Exclude<Value, MissingPathValue | null | undefined>,
        ] extends [KnownNonContainer]
      ? true
      : false;
type HasKnownNonContainerTraversal<
  T,
  Segments extends readonly PropertyKey[],
> = Segments extends readonly [
  infer Head extends PropertyKey,
  ...infer Tail extends PropertyKey[],
]
  ? Tail extends []
    ? false
    : IsDefinitelyKnownNonContainer<PropertyAt<T, Head>> extends true
      ? true
      : HasKnownNonContainerTraversal<PropertyAt<T, Head>, Tail>
  : false;
type IsArrayLengthMutation<T, Path extends ObjectPath> =
  PathSegments<Path> extends readonly [
    ...infer Parent extends PropertyKey[],
    infer Last extends PropertyKey,
  ]
    ? Last extends "length"
      ? Extract<
          Exclude<ResolveSegments<T, Parent>, MissingPathValue>,
          readonly unknown[]
        > extends never
        ? false
        : true
      : false
    : false;

/** A non-empty update path that does not target an array's `length`. */
export type ValidUpdatePath<T, Path extends ObjectPath> =
  IsDynamicPath<Path> extends true
    ? Path
    : PathSegments<Path> extends readonly []
      ? never
      : IsArrayLengthMutation<T, Path> extends true
        ? never
        : HasKnownNonContainerTraversal<T, PathSegments<Path>> extends true
          ? never
          : Path;

/** A root that is not a statically known non-plain built-in or function. */
export type ValidMutationRoot<T extends object> =
  IsAny<T> extends true ? T : T extends KnownNonContainer ? never : T;

/** The current value passed to an updater for a literal path. */
export type UpdatePathValue<T, Path extends ObjectPath> =
  IsDynamicPath<Path> extends true
    ? unknown
    :
        | Exclude<ResolvedValue<T, Path>, MissingPathValue>
        | (MissingPathValue extends ResolvedValue<T, Path>
            ? undefined
            : never);

/** The immutable result of updating a literal path. */
export type UpdatePathResult<
  T extends object,
  Path extends ObjectPath,
  Value,
> = IsDynamicPath<Path> extends true
  ? object
  : SetAtSegments<T, PathSegments<Path>, Value>;

const toSegments = (path: ObjectPath): PropertyKey[] => {
  const segments =
    typeof path === "string" ? (path === "" ? [] : path.split(".")) : [...path];
  if (segments.length === 0) {
    throw new RangeError("path must contain at least one segment");
  }
  return segments;
};
const isArrayIndex = (value: PropertyKey): boolean => {
  if (typeof value === "symbol") return false;
  const number = typeof value === "number" ? value : Number(value);
  if (typeof value === "string" && !/^(0|[1-9]\d*)$/.test(value)) return false;
  return (
    Number.isSafeInteger(number) &&
    number >= 0 &&
    number < 4_294_967_295
  );
};
const isContainer = (
  value: unknown
): value is Record<PropertyKey, unknown> => {
  if (value === null || typeof value !== "object") return false;
  if (Array.isArray(value)) return true;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};
const defineDataProperty = (
  object: Record<PropertyKey, unknown>,
  key: PropertyKey,
  value: unknown
): void => {
  if (Array.isArray(object) && key === "length") {
    Object.defineProperty(object, key, { value });
    return;
  }
  Object.defineProperty(object, key, {
    value,
    enumerable: true,
    configurable: true,
    writable: true,
  });
};
const cloneContainer = (
  value: Record<PropertyKey, unknown>,
  omittedKey: PropertyKey
): Record<PropertyKey, unknown> => {
  const clone = Array.isArray(value)
    ? new Array(value.length)
    : Object.create(Object.getPrototypeOf(value));
  for (const key of Reflect.ownKeys(value)) {
    if (key === omittedKey || (Array.isArray(value) && key === "length")) {
      continue;
    }
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor !== undefined) Object.defineProperty(clone, key, descriptor);
  }
  if (Array.isArray(value)) {
    Object.defineProperty(
      clone,
      "length",
      Object.getOwnPropertyDescriptor(value, "length")!
    );
  }
  return clone;
};
const defineReplacementProperty = (
  object: Record<PropertyKey, unknown>,
  source: unknown,
  key: PropertyKey,
  value: unknown
): void => {
  const descriptor = isContainer(source)
    ? Object.getOwnPropertyDescriptor(source, key)
    : undefined;
  if (descriptor === undefined) {
    defineDataProperty(object, key, value);
    return;
  }
  Object.defineProperty(object, key, {
    value,
    enumerable: descriptor.enumerable ?? false,
    configurable: descriptor.configurable ?? false,
    writable: "writable" in descriptor ? descriptor.writable : true,
  });
};
const readOwn = (value: unknown, key: PropertyKey): unknown =>
  isContainer(value) && Object.prototype.hasOwnProperty.call(value, key)
    ? Reflect.get(value, key)
    : undefined;

/** Immutably updates the value at an object path, creating missing containers. */
export const updatePath = <
  T extends object,
  const Path extends ObjectPath,
  Value,
>(
  object: T & ValidMutationRoot<T>,
  path: Path & ValidUpdatePath<T, Path>,
  update: (this: void, current: UpdatePathValue<T, Path>) => Value
): UpdatePathResult<T, Path, Value> => {
  if (!isContainer(object)) {
    throw new TypeError("object must be a plain object or array");
  }

  const segments = toSegments(path);
  const root = cloneContainer(object, segments[0]!);
  let source: unknown = object;
  let target = root;

  segments.forEach((segment, index) => {
    const existing = readOwn(source, segment);
    if (index === segments.length - 1) {
      if (Array.isArray(target) && segment === "length") {
        throw new TypeError("path cannot mutate an array's length");
      }
      defineReplacementProperty(
        target,
        source,
        segment,
        update(existing as UpdatePathValue<T, Path>)
      );
      return;
    }

    if (
      existing !== null &&
      (typeof existing === "object" || typeof existing === "function") &&
      !isContainer(existing)
    ) {
      throw new TypeError("path cannot traverse a non-plain object");
    }
    const next = isContainer(existing)
      ? cloneContainer(existing, segments[index + 1]!)
      : isArrayIndex(segments[index + 1]!)
        ? []
        : {};
    defineReplacementProperty(target, source, segment, next);
    source = existing;
    target = next as unknown as Record<PropertyKey, unknown>;
  });
  return root as UpdatePathResult<T, Path, Value>;
};
