export type PartitionPredicate<Value> = (
  this: void,
  value: Value,
  index: number,
  array: readonly (Value | undefined)[]
) => boolean;

export type PartitionTypeGuard<Value, Match extends Value> = (
  this: void,
  value: Value,
  index: number,
  array: readonly (Value | undefined)[]
) => value is Match;

export type PartitionResult<Value> = [matches: Value[], nonMatches: Value[]];

export type GuardedPartitionResult<Value, Match extends Value> = [
  matches: Match[],
  nonMatches: Exclude<Value, Match>[],
];

/** Splits values into matching and non-matching groups. */
export function partition<Value, Match extends Value>(
  array: readonly Value[],
  predicate: PartitionTypeGuard<Value, Match>
): GuardedPartitionResult<Value, Match>;
export function partition<Value>(
  array: readonly Value[],
  predicate: PartitionPredicate<Value>
): PartitionResult<Value>;
export function partition<Value>(
  array: readonly Value[],
  predicate: PartitionPredicate<Value>
): PartitionResult<Value> {
  const matches: Value[] = [];
  const nonMatches: Value[] = [];

  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) continue;
    const value = array[index] as Value;
    (predicate(value, index, array) ? matches : nonMatches).push(value);
  }

  return [matches, nonMatches];
}
