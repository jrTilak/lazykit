import { sortBy, type SortBySelector } from "./sortBy";

type User = { name: string; age: number };

const selectors = [
  (user: User) => user.age,
  (user: User) => user.name
] satisfies ReadonlyArray<SortBySelector<User>>;

const users: User[] = sortBy(
  [{ name: "Lin", age: 30 }, { name: "Ada", age: 30 }],
  ...selectors
);
// [{ name: "Ada", age: 30 }, { name: "Lin", age: 30 }]
