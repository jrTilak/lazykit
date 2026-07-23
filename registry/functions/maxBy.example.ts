import { maxBy } from "./maxBy";

const highest = maxBy(
  [{ name: "A", score: 8 }, { name: "B", score: 10 }],
  (item) => item.score
);
