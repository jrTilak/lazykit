/**
 * Maps values asynchronously with bounded concurrency and source-ordered results.
 * After the first failure, no idle worker starts another callback and the returned
 * promise rejects immediately. Callbacks already in flight may settle in the background.
 */
export type MapConcurrentTransform<T, Return> = (
  this: void,
  value: T,
  index: number,
  array: readonly (T | undefined)[]
) => Return | PromiseLike<Return>;

export const mapConcurrent = async <T, Return>(
  array: readonly T[],
  concurrency: number,
  transform: MapConcurrentTransform<T, Return>
): Promise<Array<Awaited<Return>>> => {
  if (!Number.isSafeInteger(concurrency) || concurrency < 1) {
    throw new RangeError("concurrency must be a positive safe integer");
  }

  const entries: Array<[sourceIndex: number, value: T]> = [];
  for (let index = 0; index < array.length; index += 1) {
    if (Object.hasOwn(array, index)) {
      entries.push([index, array[index] as T]);
    }
  }
  const results = new Array<Awaited<Return>>(entries.length);
  let cursor = 0;
  let failed = false;
  let rejectOnFailure: (error: unknown) => void = () => {};
  const failure = new Promise<never>((_, reject) => {
    rejectOnFailure = reject;
  });

  const worker = async () => {
    while (!failed) {
      const resultIndex = cursor;
      cursor += 1;
      const entry = entries[resultIndex];
      if (!entry) return;
      const [sourceIndex, value] = entry;

      try {
        results[resultIndex] = await transform(value, sourceIndex, array);
      } catch (error) {
        if (!failed) {
          failed = true;
          rejectOnFailure(error);
        }
      }
    }
  };

  const completion = Promise
    .all(Array.from({ length: Math.min(concurrency, entries.length) }, worker))
    .then(() => results);
  return Promise.race([completion, failure]);
};
