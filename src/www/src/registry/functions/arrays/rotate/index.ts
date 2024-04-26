/**
 * Rotates an array in the specified direction by a given number of positions.
 *
 * @param arr - The array to rotate.
 * @param n - The number of positions to rotate the array by.
 * @param dir - The direction in which to rotate the array. Defaults to "left".
 * @returns The rotated array.
 * @template T - The type of elements in the array.
 */
const rotate = <T>(
  arr: T[],
  n: number,
  dir: "left" | "right" = "left"
): T[] => {
  if (dir === "left") {
    return arr.slice(n, arr.length).concat(arr.slice(0, n));
  } else {
    return arr
      .slice(arr.length - n, arr.length)
      .concat(arr.slice(0, arr.length - n));
  }
};

export default rotate;
