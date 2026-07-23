import { chunk } from "./chunk";

const fruits = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
const result = chunk(fruits, 2, { remainder: "discard" });
// Output: [['apple', 'banana'], ['cherry', 'date']]
console.log(result);
