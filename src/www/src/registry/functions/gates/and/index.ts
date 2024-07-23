const and = (...args: any[]) => {
  if (args.length === 0) return false;
  return args.every((arg) => Boolean(arg));
};

export default and;
