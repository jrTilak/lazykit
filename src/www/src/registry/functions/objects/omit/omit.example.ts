import omit from ".";

const obj = { a: 1, b: 2, c: 3 };
const keys = ["a", "c"] as Array<keyof typeof obj>;
// You have to specify the keys as an array of keyof typeof obj to ensure that the keys are valid, If you are defining the keys separately.

const omitted = omit(obj, keys);
console.log(omitted);
// Expected output: { b: 2 }

//OR
const omitted2 = omit(obj, ["a", "c"]);
console.log(omitted2);
// Expected output: { b: 2 }
