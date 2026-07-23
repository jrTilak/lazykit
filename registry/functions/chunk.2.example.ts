import { chunk } from "./chunk";

const numbers = [1, 2, 3, 4, 5];
const result = chunk(numbers, 2, { remainder: "discard" });
// Output: [[1, 2], [3, 4]]
console.log(result);
