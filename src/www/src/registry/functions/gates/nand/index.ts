const nand = (...args: any[]) => {
  if (args.length === 0) return false;
  const and = args.every((arg) => Boolean(arg));
  return !and;
};

export default nand;
