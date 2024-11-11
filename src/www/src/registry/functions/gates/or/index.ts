/**
* Performs a logical OR operation on the given arguments.
**/
const or = (...args: unknown[]) => {
  return args.some((arg) => Boolean(arg));
};

export default or;
