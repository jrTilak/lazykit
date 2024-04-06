// advanced example

import chunk from ".";

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(chunk(arr, 2));
// Expected output: [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]

console.log(chunk(arr, 3, true));
// Expected output: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]

console.log(chunk(arr, 4, true));
// Expected output: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10]]
