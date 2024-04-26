import partition from ".";

const arr = [1, 2, 3, 4, 5];
partition(arr, (value) => value % 2 === 0);
// Expected: [[2, 4], [1, 3, 5]]
