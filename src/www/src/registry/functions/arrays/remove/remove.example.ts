import remove from ".";

// for a index
remove([1, 2, 3, 4, 5], 2);
// Expected Output: [1, 2, 4, 5]

// for array of indices
remove([1, 2, 3, 4, 5], [1, 3]);
// Expected Output: [1, 3, 5]

// for negative index
remove([1, 2, 3, 4, 5], -2);
// Expected Output: [1, 2, 3, 5]

// for mixed indices
remove([1, 2, 3, 4, 5], [1, -3]);
// Expected Output: [1, 4, 5]
