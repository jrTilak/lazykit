import pick from ".";

const obj = { a: 1, b: 2, c: 3 };
const result = pick(obj, ["a", "c"]);
console.log(result);
// Expected output: { a: 1, c: 3 }

const emptyResult = pick(obj, []);
console.log(emptyResult);
// Expected output: {}

const keys = ["a", "b"] as Array<keyof typeof obj>;
// You have to specify the keys as an array of keyof typeof obj to ensure that the keys are valid, If you are defining the keys separately.
const resultWithKeys = pick(obj, keys);
console.log(resultWithKeys);
// Expected output: { a: 1, b: 2 }
