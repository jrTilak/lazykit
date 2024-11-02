/**
* Calls a function n times and returns an array of the results.
**/

/**
* Calls a function n times and returns an array of the results.
**/

const nTimes = <T>(fn: (i: number) => T, n: number = 1): T[] => {
  if (n < 0) {
    throw new Error("n must be greater than 0");
  }
  let result: T[] = [];
  for (let i = 0; i < n; i++) {
    result.push(fn(i));
  }
  return result;
};

export default nTimes;
