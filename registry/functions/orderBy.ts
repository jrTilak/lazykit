type Sortable = string | number | bigint | boolean | Date | null | undefined;
type Order = "asc" | "desc";

type OrderRule<T> = {
  select: (value: T) => Sortable;
  order?: Order;
};

const compare = (left: Sortable, right: Sortable): number => {
  if (Object.is(left, right)) return 0;
  if (left == null) return 1;
  if (right == null) return -1;
  const a = left instanceof Date ? left.getTime() : left;
  const b = right instanceof Date ? right.getTime() : right;
  return a < b ? -1 : a > b ? 1 : 0;
};

/** Stably sorts a copy using independently directed selector rules. */
export const orderBy = <T>(
  array: readonly T[],
  rules: readonly OrderRule<T>[]
): T[] => {
  return array
    .map((value, index) => ({ value, index }))
    .sort((left, right) => {
      for (const { select, order = "asc" } of rules) {
        const result = compare(select(left.value), select(right.value));
        if (result !== 0) return order === "desc" ? -result : result;
      }
      return left.index - right.index;
    })
    .map(({ value }) => value);
};
