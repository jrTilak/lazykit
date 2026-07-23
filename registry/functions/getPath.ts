/** A dot-delimited string or an explicit list of property keys. */
export type ObjectPath = string | readonly PropertyKey[];

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
type IsAny<T> = 0 extends 1 & T ? true : false;
type IsUnknown<T> = IsAny<T> extends true
  ? false
  : unknown extends T
    ? true
    : false;

declare const missingPathValue: unique symbol;
type MissingPathValue = typeof missingPathValue;
type TupleIndexKeys<T extends readonly unknown[]> = Extract<
  Exclude<keyof T, keyof readonly unknown[]>,
  `${number}`
>;
type ArrayExtraKeys<T extends readonly unknown[]> = Exclude<
  keyof T,
  keyof any[]
>;
type NormalizedTupleIndex<Key> = Key extends number ? `${Key}` : Key;
type ArrayExtraProperty<T extends readonly unknown[], Key> =
  Key extends ArrayExtraKeys<T> ? T[Key] : MissingPathValue;
type ExplicitExtraProperty<T extends object, Base extends object, Key> =
  Key extends Exclude<keyof T, keyof Base> ? T[Key] : MissingPathValue;
type KnownBuiltinProperty<T extends object, Key> =
  T extends Date
    ? ExplicitExtraProperty<T, Date, Key>
    : T extends RegExp
      ? Key extends "lastIndex"
        ? number
        : ExplicitExtraProperty<T, RegExp, Key>
      : T extends Map<unknown, unknown>
        ? ExplicitExtraProperty<T, Map<unknown, unknown>, Key>
        : T extends ReadonlyMap<unknown, unknown>
          ? ExplicitExtraProperty<T, ReadonlyMap<unknown, unknown>, Key>
          : T extends Set<unknown>
            ? ExplicitExtraProperty<T, Set<unknown>, Key>
            : T extends ReadonlySet<unknown>
              ? ExplicitExtraProperty<T, ReadonlySet<unknown>, Key>
              : T extends WeakMap<object, unknown>
                ? ExplicitExtraProperty<T, WeakMap<object, unknown>, Key>
                : T extends WeakSet<object>
                  ? ExplicitExtraProperty<T, WeakSet<object>, Key>
                  : T extends Promise<unknown>
                    ? ExplicitExtraProperty<T, Promise<unknown>, Key>
                    : T extends Error
                      ? Key extends "message" | "stack"
                        ?
                            | T[Extract<Key, keyof T>]
                            | MissingPathValue
                        : ExplicitExtraProperty<T, Error, Key>
                      : never;
type IsKnownBuiltin<T> = T extends
  | Date
  | RegExp
  | Error
  | Promise<unknown>
  | ReadonlyMap<unknown, unknown>
  | ReadonlySet<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  ? true
  : false;
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
    ? number extends NonNullable<T>["length"]
      ? Key extends "length"
        ? number
        : Key extends number
          ? number extends Key
            ? Item | MissingPathValue
            : IsArrayIndexKey<Key> extends true
              ? Item | MissingPathValue
              : ArrayExtraProperty<NonNullable<T>, Key>
          : IsArrayIndexKey<Key> extends true
            ? Item | MissingPathValue
            : ArrayExtraProperty<NonNullable<T>, Key>
      : Key extends "length"
        ? NonNullable<T>["length"]
        : Key extends number
          ? number extends Key
            ? Item | MissingPathValue
            : IsArrayIndexKey<Key> extends true
              ? NormalizedTupleIndex<Key> extends TupleIndexKeys<NonNullable<T>>
                ? NonNullable<T>[Extract<
                    NormalizedTupleIndex<Key>,
                    keyof NonNullable<T>
                  >]
                : MissingPathValue
              : ArrayExtraProperty<NonNullable<T>, Key>
          : IsArrayIndexKey<Key> extends true
            ? NormalizedTupleIndex<Key> extends TupleIndexKeys<NonNullable<T>>
              ? NonNullable<T>[Extract<
                  NormalizedTupleIndex<Key>,
                  keyof NonNullable<T>
                >]
              : MissingPathValue
            : ArrayExtraProperty<NonNullable<T>, Key>
    : NonNullable<T> extends object
      ? IsKnownBuiltin<NonNullable<T>> extends true
        ? KnownBuiltinProperty<NonNullable<T>, Key>
        : MatchingObjectKey<NonNullable<T>, Key> extends infer Matched
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
type ResolvedValue<T, Path extends ObjectPath> = ResolveSegments<
  T,
  PathSegments<Path>
>;

/** The value found at a literal object path, or `unknown` for a dynamic path. */
export type PathValue<T, Path extends ObjectPath> =
  IsDynamicPath<Path> extends true
    ? unknown
    :
        | Exclude<ResolvedValue<T, Path>, MissingPathValue>
        | (MissingPathValue extends ResolvedValue<T, Path>
            ? undefined
            : never);

/** A path when it is valid for `T`; invalid literal paths resolve to `never`. */
export type ValidPath<T, Path extends ObjectPath> =
  IsAny<T> extends true
    ? Path
    : IsUnknown<T> extends true
      ? Path
      : IsDynamicPath<Path> extends true
        ? Path
        : [Exclude<ResolvedValue<T, Path>, MissingPathValue>] extends [never]
          ? never
          : Path;

/** The return type of `getPath`, including its optional fallback. */
export type GetPathResult<
  T,
  Path extends ObjectPath,
  Default = undefined,
> = undefined extends PathValue<T, Path>
  ? Exclude<PathValue<T, Path>, undefined> | Default
  : PathValue<T, Path>;

const toSegments = (path: ObjectPath): PropertyKey[] => {
  if (typeof path === "string") return path === "" ? [] : path.split(".");
  return [...path];
};

/** Reads an own property at a dot-delimited or segment-based object path. */
export function getPath<T, const Path extends ObjectPath>(
  object: T,
  path: Path & ValidPath<T, Path>
): GetPathResult<T, Path>;
export function getPath<
  T,
  const Path extends ObjectPath,
  Default,
>(
  object: T,
  path: Path & ValidPath<T, Path>,
  defaultValue: Default
): GetPathResult<T, Path, Default>;
export function getPath(
  object: unknown,
  path: ObjectPath,
  defaultValue?: unknown
): unknown {
  let current: unknown = object;
  for (const segment of toSegments(path)) {
    if (
      (typeof current !== "object" && typeof current !== "function") ||
      current === null ||
      !Object.prototype.hasOwnProperty.call(current, segment)
    ) {
      return defaultValue;
    }
    current = Reflect.get(current, segment);
  }
  return current === undefined ? defaultValue : current;
}
