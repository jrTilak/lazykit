import { partition } from "./partition";

const numbers = [1, 2, 3, 4, 5, 6];
const [evens, odds] = partition(numbers, (num) => num % 2 === 0);

console.log(evens); // Output: [2, 4, 6]
console.log(odds);  // Output: [1, 3, 5]
