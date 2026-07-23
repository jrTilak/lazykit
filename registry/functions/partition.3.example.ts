import { partition } from "./partition";

const words = ["short", "exceedingly long", "medium", "tiny"];
const [longWords, shortWords] = partition(words, (word) => word.length > 5);

console.log(longWords);  // Output: ["exceedingly long", "medium"]
console.log(shortWords); // Output: ["short", "tiny"]
