const renameKey = <T extends object, K extends keyof T, N extends string>(
  obj: T,
  key: K,
  newKey: N
): Omit<T, K> & {
  [P in N]: T[K];
} => {
  const newObj: any = { ...obj };
  newObj[newKey] = newObj[key];
  delete newObj[key];
  return newObj as Omit<T, K> & { [P in N]: T[K] };
};

export default renameKey;
