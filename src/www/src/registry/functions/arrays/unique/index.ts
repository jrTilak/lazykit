/**
 * Returns an array with unique elements from the input array.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The input array.
 * @returns {T[]} - An array with unique elements.
 */
const unique = <T>(arr: T[]): T[] => {
  //@ts-ignore
  return [...new Set(arr)];
};

export default unique;
