/**
 * Performs a logical NOR operation on the given arguments.
 * Returns true if none of the arguments are truthy, otherwise returns false.
 *
 * @param args - The arguments to perform the NOR operation on.
 * @returns The result of the NOR operation.
 */
const nor = (...args: any[]) => {
  if (args.length === 0) return false;
  const or = args.some((arg) => Boolean(arg));
  return !or;
};

export default nor;
