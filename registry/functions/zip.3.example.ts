import { zip } from "./zip";

const arrays = [[1, 2, 3], ["a", "b", "c", "d"], [true, false]];
const result = zip(arrays, { mode: "longest" });

console.log(result);
// Output: [[1, "a", true], [2, "b", false], [3, "c", undefined], [undefined, "d", undefined]]
