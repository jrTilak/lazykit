const unique = <T>(arr: T[]): T[] => {
  //@ts-ignore
  return [...new Set(arr)];
};

export default unique;
