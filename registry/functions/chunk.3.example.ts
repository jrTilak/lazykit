import { chunk } from "./chunk";

const numbers = [1, 2, 3, 4, 5];
const result = chunk(numbers, 3, { remainder: "wrap" });
// Output: [[1, 2, 3], [4, 5, 1]]
console.log(result);
