type Falsy = false | 0 | 0n | "" | null | undefined;

/** Returns a new array containing only truthy values. */
export const compact = <T>(array: readonly T[]): Array<Exclude<T, Falsy>> => {
  return array.filter(Boolean) as Array<Exclude<T, Falsy>>;
};
