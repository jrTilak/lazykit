import type { DifferenceBySelector } from "../registry/functions/differenceBy";
import type { IntersectionBySelector } from "../registry/functions/intersectionBy";
import type { MapConcurrentTransform } from "../registry/functions/mapConcurrent";
import type { MaxBySelector } from "../registry/functions/maxBy";
import type { MinBySelector } from "../registry/functions/minBy";
import type {
  PartitionPredicate,
  PartitionTypeGuard,
} from "../registry/functions/partition";
import type { SumBySelector } from "../registry/functions/sumBy";
import type { UnionBySelector } from "../registry/functions/unionBy";
import type { UniqueBySelector } from "../registry/functions/uniqueBy";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends
    (<Value>() => Value extends Right ? 1 : 2)
    ? true
    : false;

type Expect<Value extends true> = Value;
type CallbackValue<Callback extends (...args: never[]) => unknown> =
  Parameters<Callback>[0];
type CallbackArrayElement<Callback extends (...args: never[]) => unknown> =
  Parameters<Callback>[2][number];

type Source = { readonly source: true };
type Comparison = { readonly comparison: true };
type Value = { readonly value: true };
type Match = Value & { readonly match: true };

// Indexed-access types are unaffected by noUncheckedIndexedAccess, so these
// contracts prove that `undefined` is part of the public callback array type.
type _DifferenceArrayElement = Expect<
  Equal<
    CallbackArrayElement<
      DifferenceBySelector<Source, Comparison, PropertyKey>
    >,
    Source | Comparison | undefined
  >
>;
type _IntersectionArrayElement = Expect<
  Equal<
    CallbackArrayElement<
      IntersectionBySelector<Source, Comparison, PropertyKey>
    >,
    Source | Comparison | undefined
  >
>;
type _UnionArrayElement = Expect<
  Equal<
    CallbackArrayElement<UnionBySelector<Value, PropertyKey>>,
    Value | undefined
  >
>;
type _UniqueArrayElement = Expect<
  Equal<
    CallbackArrayElement<UniqueBySelector<Value, PropertyKey>>,
    Value | undefined
  >
>;
type _PartitionArrayElement = Expect<
  Equal<CallbackArrayElement<PartitionPredicate<Value>>, Value | undefined>
>;
type _PartitionGuardArrayElement = Expect<
  Equal<
    CallbackArrayElement<PartitionTypeGuard<Value | Match, Match>>,
    Value | Match | undefined
  >
>;
type _SumArrayElement = Expect<
  Equal<CallbackArrayElement<SumBySelector<Value>>, Value | undefined>
>;
type _MaxArrayElement = Expect<
  Equal<CallbackArrayElement<MaxBySelector<Value>>, Value | undefined>
>;
type _MinArrayElement = Expect<
  Equal<CallbackArrayElement<MinBySelector<Value>>, Value | undefined>
>;
type _MapConcurrentArrayElement = Expect<
  Equal<
    CallbackArrayElement<MapConcurrentTransform<Value, string>>,
    Value | undefined
  >
>;

// A callback is never invoked for a hole, so its value argument stays exact.
type _DifferenceValue = Expect<
  Equal<
    CallbackValue<DifferenceBySelector<Source, Comparison, PropertyKey>>,
    Source | Comparison
  >
>;
type _IntersectionValue = Expect<
  Equal<
    CallbackValue<IntersectionBySelector<Source, Comparison, PropertyKey>>,
    Source | Comparison
  >
>;
type _UnionValue = Expect<
  Equal<CallbackValue<UnionBySelector<Value, PropertyKey>>, Value>
>;
type _UniqueValue = Expect<
  Equal<CallbackValue<UniqueBySelector<Value, PropertyKey>>, Value>
>;
type _PartitionValue = Expect<
  Equal<CallbackValue<PartitionPredicate<Value>>, Value>
>;
type _PartitionGuardValue = Expect<
  Equal<CallbackValue<PartitionTypeGuard<Value | Match, Match>>, Value | Match>
>;
type _SumValue = Expect<Equal<CallbackValue<SumBySelector<Value>>, Value>>;
type _MaxValue = Expect<Equal<CallbackValue<MaxBySelector<Value>>, Value>>;
type _MinValue = Expect<Equal<CallbackValue<MinBySelector<Value>>, Value>>;
type _MapConcurrentValue = Expect<
  Equal<CallbackValue<MapConcurrentTransform<Value, string>>, Value>
>;
