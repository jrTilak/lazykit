import zip from ".";

const arr = [
  [1, 2, 3],
  ["a", "b"],
];

const result = zip({ arr });
console.log(result);
// Expected output: [[1, "a"], [2, "b"], [3, undefined]]

// strict mode
const resultStrict = zip({ arr, strict: true });
console.log(resultStrict);
// Expected output: [[1, "a"], [2, "b"]]
