/**
 * Performs a logical NAND operation on the given arguments.
 **/

const nand = (...args: unknown[]) => {
  if (args.length === 0) return false;
  const and = args.every((arg) => Boolean(arg));
  return !and;
};

export default nand;
