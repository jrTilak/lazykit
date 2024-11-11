/**
 * Sleeps the execution for the specified number of milliseconds.
 **/
const sleep = (ms: number): Promise<true> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};

export default sleep;
