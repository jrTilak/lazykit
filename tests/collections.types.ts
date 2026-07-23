import {
  countBy,
  type CountByKeySelector,
  type CountByResult,
} from "../registry/functions/countBy";
import {
  invert,
  type InvertInput,
  type InvertResult,
} from "../registry/functions/invert";
import {
  keyBy,
  type KeyByKeySelector,
  type KeyByResult,
} from "../registry/functions/keyBy";
import {
  mapKeys,
  type MapKeysResult,
  type MapKeysSourceKey,
  type RuntimeObjectKey,
} from "../registry/functions/mapKeys";
import {
  partition,
  type GuardedPartitionResult,
  type PartitionResult,
} from "../registry/functions/partition";
import {
  promiseAllObject,
  type PromiseAllObjectResult,
} from "../registry/functions/promiseAllObject";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends
    (<Value>() => Value extends Right ? 1 : 2)
    ? true
    : false;

type Expect<Value extends true> = Value;

const countSelector: CountByKeySelector<number, "even" | "odd"> = (value) =>
  value % 2 === 0 ? "even" : "odd";
const counts = countBy([1, 2, 3], countSelector);
type CountContract = Expect<
  Equal<typeof counts, CountByResult<"even" | "odd">>
>;
const possibleCount: number | undefined = counts.even;
// @ts-expect-error a selector's possible key is not guaranteed to occur
const requiredCount: number = counts.even;
// @ts-expect-error the selector never returns this key
counts.unknown;

const rows = [
  { id: "first", value: 1 },
  { id: "second", value: 2 },
] as const;
const keySelector: KeyByKeySelector<
  (typeof rows)[number],
  "first" | "second"
> = (row) => row.id;
const rowsById = keyBy(rows, keySelector);
type KeyByContract = Expect<
  Equal<
    typeof rowsById,
    KeyByResult<(typeof rows)[number], "first" | "second">
  >
>;
const possibleRow: (typeof rows)[number] | undefined = rowsById.first;
// @ts-expect-error a key selector does not guarantee that a row exists
const requiredRow: (typeof rows)[number] = rowsById.first;

const source = { 1: "one", named: "two" } as const;
type RuntimeSourceKeys = Expect<
  Equal<MapKeysSourceKey<typeof source>, "1" | "named">
>;
type BroadNumericRuntimeKey = Expect<Equal<RuntimeObjectKey<number>, string>>;
const mapped = mapKeys(source, (_value, key) =>
  key === "1" ? "numeric" as const : "text" as const
);
type MapKeysContract = Expect<
  Equal<
    typeof mapped,
    MapKeysResult<typeof source, "numeric" | "text">
  >
>;
const possibleMappedValue: "one" | "two" | undefined = mapped.numeric;
// @ts-expect-error a transform's possible output key may be absent
const requiredMappedValue: "one" | "two" = mapped.numeric;

const inverted = invert({ ok: 200, alias: 200, missing: 404 } as const);
type InvertContract = Expect<
  Equal<
    typeof inverted,
    {
      200?: "ok" | "alias";
      404?: "missing";
    }
  >
>;
type ExportedInvertContract = Expect<
  Equal<
    typeof inverted,
    InvertResult<{ readonly ok: 200; readonly alias: 200; readonly missing: 404 }>
  >
>;
const invertedNumericSourceKey = invert({ 1: "one" } as const);
const runtimeStringKey: "1" | undefined = invertedNumericSourceKey.one;
declare const optionalMapping: {
  readonly primary: "one";
  readonly secondary?: "two";
};
const optionalInverse = invert(optionalMapping);
type OptionalInvertContract = Expect<
  Equal<
    typeof optionalInverse,
    { one?: "primary"; two?: "secondary" }
  >
>;
type InvertInputContract = Expect<
  Equal<InvertInput<typeof optionalMapping>, typeof optionalMapping>
>;
declare const possiblyUndefinedMapping: { value: string | undefined };
// @ts-expect-error a required property can be present with undefined
invert(possiblyUndefinedMapping);
// @ts-expect-error values must be valid JavaScript property keys
invert({ invalid: { nested: true } });

const mixed: Array<string | number | Date> = ["one", 2, new Date()];
const [strings, nonStrings] = partition(
  mixed,
  (value): value is string => typeof value === "string"
);
type GuardMatches = Expect<Equal<typeof strings, string[]>>;
type GuardNonMatches = Expect<Equal<typeof nonStrings, Array<number | Date>>>;
type ExportedGuardResult = Expect<
  Equal<
    GuardedPartitionResult<string | number | Date, string>,
    [matches: string[], nonMatches: Array<number | Date>]
  >
>;

const [truthyIndex, otherIndex] = partition(
  mixed,
  (_value, index) => index > 0
);
type BooleanMatches = Expect<
  Equal<typeof truthyIndex, Array<string | number | Date>>
>;
type BooleanNonMatches = Expect<
  Equal<typeof otherIndex, Array<string | number | Date>>
>;
type ExportedPartitionResult = Expect<
  Equal<
    PartitionResult<string | number>,
    [matches: Array<string | number>, nonMatches: Array<string | number>]
  >
>;

const promised = promiseAllObject({
  count: Promise.resolve(1 as const),
  ready: true as const,
} as const);
type PromiseResult = Expect<
  Equal<Awaited<typeof promised>, { count: 1; ready: true }>
>;
type ExportedPromiseResult = Expect<
  Equal<
    PromiseAllObjectResult<{
      readonly count: Promise<1>;
      readonly ready: true;
    }>,
    { count: 1; ready: true }
  >
>;

declare const optionalPromise: { readonly value?: Promise<number> };
const optionalResult = promiseAllObject(optionalPromise);
type OptionalPromiseResult = Expect<
  Equal<Awaited<typeof optionalResult>, { value?: number }>
>;

// @ts-expect-error arrays are rejected instead of being returned as plain objects
promiseAllObject([Promise.resolve(1)] as const);
// @ts-expect-error functions are not plain objects
promiseAllObject(() => Promise.resolve(1));
// @ts-expect-error a callable result.then would be assimilated by the returned Promise
promiseAllObject({ then: () => undefined });

void possibleCount;
void requiredCount;
void possibleRow;
void requiredRow;
void possibleMappedValue;
void requiredMappedValue;
void runtimeStringKey;
