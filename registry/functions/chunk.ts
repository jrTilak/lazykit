export type ChunkOptions = {
  remainder?: "keep" | "discard" | "wrap";
};

/** Splits an array into fixed-size groups without mutating the input. */
export const chunk = <const T>(
  array: readonly T[],
  size: number,
  { remainder = "keep" }: ChunkOptions = {},
): T[][] => {
  if (!Number.isSafeInteger(size) || size <= 0) {
    throw new RangeError("size must be a positive safe integer");
  }
  if (remainder !== "keep" && remainder !== "discard" && remainder !== "wrap") {
    throw new RangeError("remainder must be keep, discard, or wrap");
  }
  const values: T[] = [];
  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) {
      throw new TypeError("array must not contain empty slots");
    }
    values.push(array[index] as T);
  }

  if (values.length === 0) return [];

  const chunks: T[][] = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }

  const lastChunk = chunks[chunks.length - 1];
  if (!lastChunk) return chunks;
  if (lastChunk.length === size) return chunks;

  if (remainder === "discard") {
    chunks.pop();
  } else if (remainder === "wrap") {
    let sourceIndex = 0;
    while (lastChunk.length < size) {
      lastChunk.push(values[sourceIndex % values.length] as T);
      sourceIndex += 1;
    }
  }

  return chunks;
};
