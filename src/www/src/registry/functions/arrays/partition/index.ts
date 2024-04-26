/**
 * Partitions an array into two separate arrays based on a given predicate.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array to be partitioned.
 * @param {(value: T, index: number, array: T[]) => boolean} predicate - The predicate function used to determine the partition.
 * @returns {[T[], T[]]} - An array containing two arrays: the first array contains elements that satisfy the predicate, and the second array contains elements that do not satisfy the predicate.
 */
const partition = <T>(
  arr: T[],
  predicate: (value: T, i: number, arr: T[]) => boolean
): [T[], T[]] => {
  const pass: T[] = [];
  const fail: T[] = [];
  arr.forEach((...args) => {
    // run the predicate function on each element in the array
    // and push the element to the appropriate array
    (predicate(...args) ? pass : fail).push(args[0]);
  });
  return [pass, fail];
};

export default partition;
