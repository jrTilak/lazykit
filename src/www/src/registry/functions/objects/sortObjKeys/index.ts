
/**
 * Sorts the keys of an object in ascending or descending order.
 *
 * @template T - The type of the object.
 * @param {T} obj - The object whose keys are to be sorted.
 * @param {boolean} [ascending=true] - Whether to sort the keys in ascending order. Defaults to true.
 * @returns {{ [K in keyof T]: T[K] }} - A new object with sorted keys.
 */
const sortObjKeys = <T extends object>(
  obj: T,
  ascending: boolean = true
): { [K in keyof T]: T[K] } => {
  return Object.fromEntries(
    Object.entries(obj).sort(([a], [b]) =>
      ascending ? a.localeCompare(b) : b.localeCompare(a)
    )
  ) as { [K in keyof T]: T[K] };
};

export default sortObjKeys;