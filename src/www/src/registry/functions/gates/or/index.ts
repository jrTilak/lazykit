const or = (...args: any[]) => {
  return args.some((arg) => Boolean(arg));
};

export default or;
