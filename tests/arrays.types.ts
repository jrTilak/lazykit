import { chunk } from "../registry/functions/chunk";
import { compact, type Falsy } from "../registry/functions/compact";
import { difference } from "../registry/functions/difference";
import {
  differenceBy,
  type DifferenceBySelector,
} from "../registry/functions/differenceBy";
import { intersection } from "../registry/functions/intersection";
import {
  intersectionBy,
  type IntersectionBySelector,
} from "../registry/functions/intersectionBy";
import { maxBy, type MaxBySelector } from "../registry/functions/maxBy";
import { minBy, type MinBySelector } from "../registry/functions/minBy";
import { moveItem } from "../registry/functions/moveItem";
import { shuffle } from "../registry/functions/shuffle";
import { slidingWindow } from "../registry/functions/slidingWindow";
import { sumBy, type SumBySelector } from "../registry/functions/sumBy";
import {
  unionBy,
  type UnionBySelector,
  type UnionByValue,
} from "../registry/functions/unionBy";
import { unique } from "../registry/functions/unique";
import {
  uniqueBy,
  type UniqueBySelector,
} from "../registry/functions/uniqueBy";
import {
  zip,
  type ZipMode,
  type Zipped,
  type ZippedLongest,
} from "../registry/functions/zip";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <
    Value,
  >() => Value extends Right ? 1 : 2
    ? true
    : false;

type Expect<Value extends true> = Value;

const chunks = chunk([1, "two"] as const, 2);
type _ChunkElement = Expect<Equal<(typeof chunks)[number][number], 1 | "two">>;

const compacted = compact([0, 1, "", "ready", false, null, undefined] as const);
type _CompactedElement = Expect<Equal<(typeof compacted)[number], 1 | "ready">>;
type _FalsyValues = Expect<
  Equal<Falsy, false | 0 | 0n | "" | null | undefined>
>;

const remaining = difference(
  [1, 2] as const,
  [2, 3] as const,
  ["unrelated comparison values"] as const,
);
type _DifferenceUsesSourceElement = Expect<
  Equal<(typeof remaining)[number], 1 | 2>
>;

const sourceRows = [
  { id: 1, source: "primary-a" },
  { id: 2, source: "primary-b" },
] as const;
const comparisonRows = [
  { id: 2, external: true },
  { id: 3, external: false },
] as const;

const byDifference = differenceBy(
  sourceRows,
  [comparisonRows],
  (value, index, array) => {
    const id: 1 | 2 | 3 = value.id;
    const position: number = index;
    const currentArray: readonly (
      | (typeof sourceRows)[number]
      | (typeof comparisonRows)[number]
      | undefined
    )[] = array;
    void [position, currentArray];
    return id;
  },
);
type _DifferenceByUsesSourceElement = Expect<
  Equal<(typeof byDifference)[number], (typeof sourceRows)[number]>
>;

const differenceSelector: DifferenceBySelector<
  (typeof sourceRows)[number],
  (typeof comparisonRows)[number],
  number
> = (value, _index, _array) => value.id;

const shared = intersection(
  ["read", "write"] as const,
  ["write", "delete"] as const,
  [1, "write"] as const,
);
type _IntersectionUsesSourceElement = Expect<
  Equal<(typeof shared)[number], "read" | "write">
>;

const byIntersection = intersectionBy(
  sourceRows,
  [comparisonRows],
  (value, _index, _array) => value.id,
);
type _IntersectionByUsesSourceElement = Expect<
  Equal<(typeof byIntersection)[number], (typeof sourceRows)[number]>
>;

const intersectionSelector: IntersectionBySelector<
  (typeof sourceRows)[number],
  (typeof comparisonRows)[number],
  number
> = (value, _index, _array) => value.id;

const maximum = maxBy(
  ["short", "long"] as const,
  (value, index, array) => value.length + index + array.length,
);
const minimum = minBy(
  ["short", "long"] as const,
  (value, index, array) => value.length + index + array.length,
);
type _Maximum = Expect<Equal<typeof maximum, "short" | "long" | undefined>>;
type _Minimum = Expect<Equal<typeof minimum, "short" | "long" | undefined>>;
const maxSelector: MaxBySelector<string> = (value, index, array) =>
  value.length + index + array.length;
const minSelector: MinBySelector<string> = (value, index, array) =>
  value.length + index + array.length;

const moved = moveItem(["first", "second", "third"] as const, 0, 2);
const shuffled = shuffle(["heads", "tails"] as const);
const windows = slidingWindow([1, 2, 3] as const, 2);
type _MovedElement = Expect<
  Equal<(typeof moved)[number], "first" | "second" | "third">
>;
type _ShuffledElement = Expect<
  Equal<(typeof shuffled)[number], "heads" | "tails">
>;
type _WindowElement = Expect<
  Equal<(typeof windows)[number][number], 1 | 2 | 3>
>;

const total: number = sumBy(
  [{ amount: 1 }, { amount: 2 }] as const,
  (value, index, array) => value.amount + index + array.length,
);
const sumSelector: SumBySelector<{ amount: number }> = (value, index, array) =>
  value.amount + index + array.length;
// @ts-expect-error selectors must return numbers
sumBy(["one"], (value) => value);

const union = unionBy(
  [[{ kind: "left", left: 1 }], [{ kind: "right", right: true }]] as const,
  (value, index, array) => {
    const kind: "left" | "right" = value.kind;
    const position: number = index;
    const length: number = array.length;
    void [position, length];
    return kind;
  },
);
type _UnionElement = Expect<
  Equal<
    (typeof union)[number],
    | { readonly kind: "left"; readonly left: 1 }
    | { readonly kind: "right"; readonly right: true }
  >
>;
type _UnionValueAlias = Expect<
  Equal<
    UnionByValue<
      readonly [
        readonly [{ readonly kind: "left" }],
        readonly [{ readonly kind: "right" }],
      ]
    >,
    { readonly kind: "left" } | { readonly kind: "right" }
  >
>;
const unionSelector: UnionBySelector<{ id: number }, number> = (
  value,
  _index,
  _array,
) => value.id;

const distinct = unique([1, "one", 1] as const);
const distinctBy = uniqueBy(
  [{ id: 1 }, { id: 2 }] as const,
  (value, index, array) => value.id + index + array.length,
);
type _UniqueElement = Expect<Equal<(typeof distinct)[number], 1 | "one">>;
type _UniqueByElement = Expect<
  Equal<(typeof distinctBy)[number], { readonly id: 1 } | { readonly id: 2 }>
>;
const uniqueSelector: UniqueBySelector<{ id: number }, number> = (
  value,
  _index,
  _array,
) => value.id;

const zipped = zip([[1, 2] as const, ["a", "b"] as const] as const);
const zippedLongest = zip([[1] as const, ["a", "b"] as const] as const, {
  mode: "longest",
});
type _ZippedElement = Expect<
  Equal<(typeof zipped)[number], [1 | 2, "a" | "b"]>
>;
type _ZippedLongestElement = Expect<
  Equal<(typeof zippedLongest)[number], [1 | undefined, "a" | "b" | undefined]>
>;
type _ZippedAlias = Expect<
  Equal<
    Zipped<readonly [readonly number[], readonly string[]]>,
    [number, string]
  >
>;
type _ZippedLongestAlias = Expect<
  Equal<
    ZippedLongest<readonly [readonly number[], readonly string[]]>,
    [number | undefined, string | undefined]
  >
>;
const mode: ZipMode = Math.random() > 0.5 ? "shortest" : "longest";
const dynamicMode = zip([[1], ["a"]] as const, { mode });
type _DynamicZipElement = Expect<
  Equal<
    (typeof dynamicMode)[number],
    [1, "a"] | [1 | undefined, "a" | undefined]
  >
>;

// @ts-expect-error unsupported chunk modes are rejected
chunk([1], 1, { remainder: "pad" });
// @ts-expect-error unsupported zip modes are rejected
zip([[1]], { mode: "middle" });

void [
  differenceSelector,
  intersectionSelector,
  maxSelector,
  minSelector,
  total,
  sumSelector,
  unionSelector,
  uniqueSelector,
  dynamicMode,
];
