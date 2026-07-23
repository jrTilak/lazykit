import { zip } from "./zip";

const arrays = [[1, 2, 3], ["a", "b", "c", "d"]];
const result = zip(arrays);

console.log(result);
// Output: [[1, "a"], [2, "b"], [3, "c"]]
