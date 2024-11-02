/**
 * Returns a sample object with the specified keys and values as random numbers.
 **/
const sampleObj = <R extends Record<string | number | symbol, number>>(
  ...keys: string[]
) => {
  const obj: any = {};
  keys.forEach((key) => {
    obj[key] = Math.random();
  });
  return obj as R | Record<string, number>;
};

export default sampleObj;
