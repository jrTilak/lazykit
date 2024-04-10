import chunk from ".";

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// No size provided, default size is 1
console.log(chunk(arr));
// Expected output: [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]];

// Providing size as 2
console.log(chunk(arr, 2));
// Expected output: [ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ], [ 7, 8 ], [ 9, 10 ] ]

// Providing size as 3 and strict as true
console.log(chunk(arr, 3, true));
// Expected output: [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ]

// Providing size as 4 and strict as true
console.log(chunk(arr, 4, true));
// Expected output: [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8 ] ]
