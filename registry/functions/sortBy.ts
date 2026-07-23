type Sortable = string | number | bigint | boolean | Date | null | undefined;

const compare = (left: Sortable, right: Sortable): number => {
  if (Object.is(left, right)) return 0;
  if (left == null) return 1;
  if (right == null) return -1;
  const a = left instanceof Date ? left.getTime() : left;
  const b = right instanceof Date ? right.getTime() : right;
  return a < b ? -1 : a > b ? 1 : 0;
};

/** Stably sorts a copy by one or more derived values. */
export const sortBy = <T>(
  array: readonly T[],
  ...selectors: ReadonlyArray<(value: T) => Sortable>
): T[] => {
  if (selectors.length === 0) return [...array];
  return array
    .map((value, index) => ({ value, index }))
    .sort((left, right) => {
      for (const selector of selectors) {
        const order = compare(selector(left.value), selector(right.value));
        if (order !== 0) return order;
      }
      return left.index - right.index;
    })
    .map(({ value }) => value);
};
