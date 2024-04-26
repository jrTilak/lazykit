type Args = {
  arr: any[][];
  strict?: boolean;
};

/**
 * Zips multiple arrays into a single array of tuples.
 *
 * @template T - The type of elements in the arrays.
 * @param {Args<any>} options - The options for zipping the arrays.
 * @param {any[][]} options.arr - The arrays to be zipped.
 * @param {boolean} [options.strict=false] - Indicates whether to zip strictly based on the minimum length of the arrays.
 * @returns {any[][]} - The zipped array of tuples.
 */
const zip = ({ arr, strict = false }: Args): any[][] => {
  const maxIndex = arr.map((a) => a.length).reduce((a, b) => Math.max(a, b), 0);
  const minIndex = arr
    .map((a) => a.length)
    .reduce((a, b) => Math.min(a, b), maxIndex);

  const result: any[][] = [];

  const upto = strict ? minIndex : maxIndex;

  for (let i = 0; i < upto; i++) {
    const zip = arr.map((a) => a[i]);
    result.push(zip);
  }
  return result;
};

export default zip;
