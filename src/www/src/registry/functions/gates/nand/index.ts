/**
 * Performs a NAND (NOT AND) operation on the given arguments.
 * Returns `false` if no arguments are provided or if all arguments are truthy.
 * Returns `true` if any argument is falsy.
 *
 * @param args - The arguments to perform the NAND operation on.
 * @returns The result of the NAND operation.
 */
const nand = (...args: any[]) => {
  if (args.length === 0) return false;
  const and = args.every((arg) => Boolean(arg));
  return !and;
};

export default nand;
