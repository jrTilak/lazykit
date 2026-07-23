export type SortByValue = string | number | bigint | boolean | Date | null | undefined;
export type SortBySelector<T> = (this: void, value: T) => SortByValue;

const rank = (value: SortByValue): number => {
  if (value == null) return 6;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? 5 : 4;
  if (typeof value === "number") return Number.isNaN(value) ? 5 : 0;
  if (typeof value === "bigint") return 1;
  if (typeof value === "string") return 2;
  return 3;
};

const compare = (left: SortByValue, right: SortByValue): number => {
  const leftRank = rank(left);
  const rightRank = rank(right);
  if (leftRank !== rightRank) return leftRank - rightRank;
  if (leftRank >= 5 || Object.is(left, right)) return 0;

  if (left instanceof Date && right instanceof Date) {
    const a = left.getTime();
    const b = right.getTime();
    return a < b ? -1 : a > b ? 1 : 0;
  }
  if (typeof left === "number" && typeof right === "number") {
    return left < right ? -1 : left > right ? 1 : 0;
  }
  if (typeof left === "bigint" && typeof right === "bigint") {
    return left < right ? -1 : left > right ? 1 : 0;
  }
  if (typeof left === "string" && typeof right === "string") {
    return left < right ? -1 : left > right ? 1 : 0;
  }
  if (typeof left === "boolean" && typeof right === "boolean") return left ? 1 : -1;
  return 0;
};

/** Stably sorts a copy by selector values computed once per input item. */
export const sortBy = <T>(
  array: readonly T[],
  ...selectors: ReadonlyArray<SortBySelector<T>>
): T[] => {
  for (const selector of selectors) {
    if (typeof selector !== "function") {
      throw new TypeError("selectors must contain only functions");
    }
  }
  const entries: Array<{ value: T; index: number }> = [];
  for (let index = 0; index < array.length; index += 1) {
    if (Object.hasOwn(array, index)) {
      entries.push({ value: array[index] as T, index });
    }
  }
  if (selectors.length === 0) return entries.map(({ value }) => value);

  return entries
    .map(({ value, index }) => ({
      value,
      index,
      selected: selectors.map((selector) => selector(value))
    }))
    .sort((left, right) => {
      for (let index = 0; index < selectors.length; index += 1) {
        const order = compare(left.selected[index], right.selected[index]);
        if (order !== 0) return order;
      }
      return left.index - right.index;
    })
    .map(({ value }) => value);
};
