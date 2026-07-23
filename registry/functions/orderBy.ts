export type OrderByValue = string | number | bigint | boolean | Date | null | undefined;
export type OrderByDirection = "asc" | "desc";

export type OrderByRule<T> = {
  select: (this: void, value: T) => OrderByValue;
  order?: OrderByDirection;
};

const rank = (value: OrderByValue): number => {
  if (value == null) return 6;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? 5 : 4;
  if (typeof value === "number") return Number.isNaN(value) ? 5 : 0;
  if (typeof value === "bigint") return 1;
  if (typeof value === "string") return 2;
  return 3;
};

const compare = (left: OrderByValue, right: OrderByValue): number => {
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

/** Stably sorts a copy using independently directed values computed once per item. */
export const orderBy = <T>(
  array: readonly T[],
  rules: readonly OrderByRule<T>[]
): T[] => {
  const normalizedRules: Array<Required<OrderByRule<T>>> = [];
  for (let index = 0; index < rules.length; index += 1) {
    if (!Object.hasOwn(rules, index)) {
      throw new TypeError("rules must not contain empty slots");
    }
    const rule = rules[index];
    if (!rule || typeof rule.select !== "function") {
      throw new TypeError("every rule must contain a select function");
    }
    const { select, order = "asc" } = rule;
    if (order !== "asc" && order !== "desc") {
      throw new RangeError('order must be "asc" or "desc"');
    }
    normalizedRules.push({ select, order });
  }

  const entries: Array<{ value: T; index: number }> = [];
  for (let index = 0; index < array.length; index += 1) {
    if (Object.hasOwn(array, index)) {
      entries.push({ value: array[index] as T, index });
    }
  }

  return entries
    .map(({ value, index }) => ({
      value,
      index,
      selected: normalizedRules.map(({ select }) => select(value))
    }))
    .sort((left, right) => {
      for (const [index, { order }] of normalizedRules.entries()) {
        const result = compare(left.selected[index], right.selected[index]);
        if (result !== 0) return order === "desc" ? -result : result;
      }
      return left.index - right.index;
    })
    .map(({ value }) => value);
};
