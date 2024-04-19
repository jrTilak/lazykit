/**
 * Inserts elements into an array at a specified index.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array to insert elements into.
 * @param {number} index - The index at which to insert the elements.
 * @param {boolean} [recursive=false] - Indicates whether to insert elements recursively. If true, the elements will be inserted at every nth index.
 * @param {...T[]} items - The elements to insert into the array.
 * @returns {T[]} - The modified array with the inserted elements.
 */
const insert = <T>(
  arr: T[],
  index: number,
  [...items]: T[],
  recursive: boolean = false
): T[] => {
  const isNegativeIndex = index < 0;
  // if index is negative, convert it to positive and reverse the array for easier insertion
  if (isNegativeIndex) {
    index = Math.abs(index);
    arr = arr.reverse();
    items = items.reverse();
  }

  if (!recursive) {
    const newArr = [...arr.slice(0, index), ...items, ...arr.slice(index)];
    return isNegativeIndex ? newArr.reverse() : newArr;
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
    return isNegativeIndex ? newArr.reverse() : newArr;
  }
};

export default insert;
