const nor = (...args: any[]) => {
  if (args.length === 0) return false;
  const or = args.some((arg) => Boolean(arg));
  return !or;
};

export default nor;
