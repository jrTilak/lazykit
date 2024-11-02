/**
 * Inserts elements into an array at a specified index.
 **/
const insert = <T>(
  arr: T[],
  index: number,
  [...items]: T[],
  recursive: boolean = false
): T[] => {
  const isNegativeIndex = index < 0;

  if (isNegativeIndex) {
    throw new Error("Negative index is not supported!");
  }

  if (!recursive) {
    const newArr = [...arr.slice(0, index), ...items, ...arr.slice(index)];
    return newArr;
  } else {
    const shouldInsert = Math.floor(arr.length / index);
    let newArr = [...arr];
    for (let i = 0; i < shouldInsert; i++) {
      const insertIndex = (i + 1) * index + i * items.length;
      newArr = [
        ...newArr.slice(0, insertIndex),
        ...items,
        ...newArr.slice(insertIndex),
      ];
    }
    return newArr;
  }
};

export default insert;
