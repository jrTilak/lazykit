const or = (...args: unknown[]) => {
  return args.some((arg) => Boolean(arg));
};

export default or;
