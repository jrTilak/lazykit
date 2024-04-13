/**
 * Performs a logical AND operation on the given boolean values.
 * Returns true if all arguments are true, otherwise returns false.
 *
 * @param args - The boolean values to perform the AND operation on.
 * @returns The result of the logical AND operation.
 */
const and = (...args: any[]) => {
  if (args.length === 0) return false;
  return args.every((arg) => Boolean(arg));
};

export default and;
