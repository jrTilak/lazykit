import sampleObj from ".";

const keys = ["key1", "key2", "key3"];
const obj = sampleObj(...keys);
console.log(obj);
// Expected output: { key1: Number, key2: Number, key3: Number }
// Where Number is a random number between 0 and 1.
