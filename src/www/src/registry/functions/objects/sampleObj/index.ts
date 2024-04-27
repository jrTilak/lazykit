/**
 * Creates an object with random number values for the given keys.
 * @param keys - The keys for the object.
 * @returns An object with random number values for the given keys.
 */
const sampleObj = (...keys: string[]) => {
  const obj: any = {};
  keys.forEach((key) => {
    obj[key] = Math.random();
  });
  return obj as Record<string, number>;
};

export default sampleObj;
