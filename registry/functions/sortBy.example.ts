import { sortBy } from "./sortBy";

const users = sortBy(
  [{ name: "Lin", age: 30 }, { name: "Ada", age: 30 }],
  (user) => user.age,
  (user) => user.name
);
