const chunk = <T>(
  array: T[],
  size: number = 1,
  strict: boolean = false
  //remove the last chunk if it is not equal to the size
): T[][] => {
  const result: T[][] = [];

  //push the chunks into the result array
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  //remove the last chunk if it is not equal to the size
  if (strict && result[result.length - 1].length !== size) {
    result.pop();
  }
  return result;
};

export default chunk;