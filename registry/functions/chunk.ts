type ChunkOptions = {
  remainder?: "keep" | "discard" | "wrap";
};

/** Splits an array into fixed-size groups without mutating the input. */
export const chunk = <T>(
  array: readonly T[],
  size: number,
  { remainder = "keep" }: ChunkOptions = {}
): T[][] => {
  if (!Number.isSafeInteger(size) || size <= 0) {
    throw new RangeError("size must be a positive safe integer");
  }

  if (array.length === 0) return [];

  const chunks: T[][] = [];
  for (let index = 0; index < array.length; index += size) {
    chunks.push(array.slice(index, index + size));
  }

  const lastChunk = chunks[chunks.length - 1];
  if (lastChunk.length === size) return chunks;

  if (remainder === "discard") {
    chunks.pop();
  } else if (remainder === "wrap") {
    let sourceIndex = 0;
    while (lastChunk.length < size) {
      lastChunk.push(array[sourceIndex % array.length]);
      sourceIndex += 1;
    }
  }

  return chunks;
};
