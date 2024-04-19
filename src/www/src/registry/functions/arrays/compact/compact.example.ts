import compact from ".";

const input = [0, false, "", null, undefined, NaN, {}, [], 1, "hello"];

// no strict mode
const result = compact(input);
console.log(result);
// Expected output: [{}, [], 1, "hello"]

// strict mode
const resultStrict = compact(input, true);
console.log(resultStrict);
// Expected output: [1, "hello"]
