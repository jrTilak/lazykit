/**
 * Splits an array into chunks of a specified size.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} array - The array to be chunked.
 * @param {number} [size=1] - The size of each chunk.
 * @param {boolean} [strict=false] - Whether to remove the last chunk if it is not equal to the size.
 * @returns {T[][]} - An array of chunks.
 */
const chunk = <T>(
  array: T[],
  size: number = 1,
  strict: boolean = false
  //remove the last chunk if it is not equal to the size
): T[][] => {
  const result: T[][] = [];

  //push the chunks into the result array
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  //remove the last chunk if it is not equal to the size
  if (strict && result[result.length - 1].length !== size) {
    result.pop();
  }
  return result;
};

export default chunk;
