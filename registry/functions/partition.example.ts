import { partition } from "./partition";

const values: Array<string | number> = ["one", 2, "three", 4];
const [strings, numbers] = partition(
  values,
  (value): value is string => typeof value === "string"
);

console.log(strings); // ["one", "three"] and typed as string[]
console.log(numbers); // [2, 4] and typed as number[]
