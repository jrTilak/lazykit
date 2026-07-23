/** Maps values asynchronously while limiting concurrent callbacks and preserving order. */
export const mapConcurrent = async <T, Return>(
  array: readonly T[],
  concurrency: number,
  transform: (value: T, index: number, array: readonly T[]) => Return | PromiseLike<Return>
): Promise<Array<Awaited<Return>>> => {
  if (!Number.isSafeInteger(concurrency) || concurrency < 1) {
    throw new RangeError("concurrency must be a positive safe integer");
  }
  const results = new Array<Awaited<Return>>(array.length);
  let nextIndex = 0;
  const worker = async () => {
    while (nextIndex < array.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await transform(array[index], index, array) as Awaited<Return>;
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, array.length) }, worker));
  return results;
};
