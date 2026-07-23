import { compact } from "./compact";

const mixedArray = [0, 1, false, 2, '', 3, null, undefined, {}, [], [4, 5]];
const result = compact(mixedArray);

console.log(result);
// Output: [1, 2, 3, {}, [], [4, 5]]
