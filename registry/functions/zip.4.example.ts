import { zip } from "./zip";

const arrays = [[1, 2, 3], ["x", "y", "z"], [10, 20]];
const strictResult = zip(arrays);

console.log(strictResult);
// Output: [[1, "x", 10], [2, "y", 20]]
