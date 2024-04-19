/**
 * Generates an array of random numbers.
 *
 * @param size - The size of the array to generate.
 * @returns An array of random numbers.
 * @throws {Error} If the size is a negative number.
 */
const sampleArr = (size: number) => {
  if (size < 0) throw new Error("Size must be a positive number");
  return Array.from({ length: size }, (_, i) => Math.floor(Math.random() * i));
};

export default sampleArr;
