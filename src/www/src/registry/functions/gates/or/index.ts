/**
 * Performs a logical OR operation on the given arguments.
 *
 * @param args - The arguments to perform the OR operation on.
 * @returns The result of the OR operation.
 */
const or = (...args: any[]) => {
  return args.some((arg) => Boolean(arg));
};

export default or;
