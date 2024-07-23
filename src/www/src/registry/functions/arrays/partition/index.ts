const partition = <T>(
  arr: T[],
  predicate: (value: T, i: number, arr: T[]) => boolean
): [T[], T[]] => {
  const pass: T[] = [];
  const fail: T[] = [];
  arr.forEach((...args) => {
    // run the predicate function on each element in the array
    // and push the element to the appropriate array
    (predicate(...args) ? pass : fail).push(args[0]);
  });
  return [pass, fail];
};

export default partition;
