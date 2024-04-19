import insert from ".";

const arr = [1, 2, 3];
const index = 1;
const items = [4, 5];

const result = insert(arr, index, items);
console.log(result);
// Expected Output: [1, 4, 5, 2, 3]

const arr2 = [1, 2, 3, 4, 5];
const index2 = 2;
const items2 = [6, 7];

const result2 = insert(arr2, index2, items2);
console.log(result2);
// Expected Output: [1, 2, 6, 7, 3, 4, 5 ]

// negative index
const arr3 = [1, 2, 3];
const index3 = -1;
const items3 = [4, 5];

const result3 = insert(arr3, index3, items3);
console.log(result3);
// Expected Output: [1, 2, 4, 5, 3]
