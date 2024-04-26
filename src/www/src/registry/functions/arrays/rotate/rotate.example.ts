import rotate from ".";

const arr = [1, 2, 3, 4, 5];
rotate(arr, 2);
// Expected Output: [3, 4, 5, 1, 2]

rotate(arr, 2, "right");
// Expected Output: [4, 5, 1, 2, 3]
