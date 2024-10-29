const unique = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

export default unique;
