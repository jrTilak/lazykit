/**
 * Creates a unique array from the input array.
 **/
const unique = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

export default unique;
