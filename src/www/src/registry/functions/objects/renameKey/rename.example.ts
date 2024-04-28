import rename from ".";

const obj = { a: 1, b: 2, c: 3 };
const result = rename(obj, "a", "d");
console.log(result);
// Expected output: { b: 2, c: 3, d: 1 }
