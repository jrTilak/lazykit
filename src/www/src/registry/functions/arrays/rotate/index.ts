/**
 * Rotates the elements of an array by a given number of positions.
 **/
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
