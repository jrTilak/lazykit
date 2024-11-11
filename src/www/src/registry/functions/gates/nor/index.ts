/**
 * Performs a logical NOR operation on the given arguments.
 **/
const nor = (...args: unknown[]) => {
  if (args.length === 0) return false;
  const or = args.some((arg) => Boolean(arg));
  return !or;
};

export default nor;
