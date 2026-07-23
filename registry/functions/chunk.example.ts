import { chunk } from "./chunk";

const numbers = [1, 2, 3, 4, 5];
const result = chunk(numbers, 2);
// Output: [[1, 2], [3, 4], [5]]
console.log(result);
