/** Returns a shuffled copy using the Fisher–Yates algorithm. */
export const shuffle = <T>(
  array: readonly T[],
  random: () => number = Math.random
): T[] => {
  const shuffled = [...array];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
      throw new RangeError("random must return a number from 0 up to, but not including, 1");
    }
    const swapIndex = Math.floor(sample * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};
