/** Returns a shuffled copy using the Fisher–Yates algorithm. */
export const shuffle = <const T>(
  array: readonly T[],
  random: (this: void) => number = Math.random,
): T[] => {
  const shuffled: T[] = [];
  for (let index = 0; index < array.length; index += 1) {
    if (!Object.hasOwn(array, index)) {
      throw new TypeError("array must not contain empty slots");
    }
    shuffled.push(array[index] as T);
  }

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
      throw new RangeError(
        "random must return a number from 0 up to, but not including, 1",
      );
    }
    const swapIndex = Math.floor(sample * (index + 1));
    const current = shuffled[index] as T;
    shuffled[index] = shuffled[swapIndex] as T;
    shuffled[swapIndex] = current;
  }

  return shuffled;
};
