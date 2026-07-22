import { zip } from "./zip";

const arrays = [[1, 2, 3], ["x", "y"]];
const strictResult = zip(arrays);

console.log(strictResult);
// Output: [[1, "x"], [2, "y"]]
