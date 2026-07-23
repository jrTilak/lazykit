import { slidingWindow } from "./slidingWindow";

const pairs = slidingWindow([1, 2, 3, 4], 2);
// [[1, 2], [2, 3], [3, 4]]
