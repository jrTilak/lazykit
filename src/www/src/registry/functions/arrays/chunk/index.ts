const chunk = <T>(
  array: T[],
  size: number,
  config?: {
    style: "normal" | "repeat" | "remove";
  }
): T[][] => {
  const result: T[][] = [];

  // Push the chunks into the result array
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  if (config?.style === "remove" && result[result.length - 1].length !== size) {
    result.pop(); // Remove the last chunk if it doesn't match the size
  } else if (config?.style === "repeat") {
    // Repeat elements from the start if the last chunk is smaller
    const lastChunk = result[result.length - 1];
    if (lastChunk.length < size) {
      const elementsNeeded = size - lastChunk.length;
      const repeatedElements = array.slice(0, elementsNeeded); // Get elements from the start
      result[result.length - 1] = lastChunk.concat(repeatedElements); // Fill the last chunk
    }
  }

  return result;
};

export default chunk;
