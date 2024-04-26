/**
 * Removes element(s) from an array based on the given index(es).
 *
 * @template T - The type of elements in the array.
 * @param {T[]} array - The array from which elements will be removed.
 * @param {number | number[]} index - The index(es) of the element(s) to be removed.
 * @returns {T[]} - A new array with the specified element(s) removed.
 */
const remove = <T>(array: T[], index: number | number[]): T[] => {
  const len = array.length;
  if (Array.isArray(index)) {
    // convert negative indices to their positive counterparts
    const indices = index.map((i) => (i < 0 ? len + i : i));
    return array.filter((_, i) => !indices.includes(i));
  }
  index = index < 0 ? len + index : index;
  return array.filter((_, i) => i !== index);
};

export default remove;
