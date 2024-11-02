/**
 * Generates an array of random numbers.
 **/
const sampleArr = (size: number) => {
  if (size < 0) throw new Error("Size must be a positive number");
  return Array.from({ length: size }, (_, i) => Math.floor(Math.random() * i));
};

export default sampleArr;
