import { uniqueBy } from "./uniqueBy";

const users = uniqueBy(
  [{ id: 1, name: "Ada" }, { id: 1, name: "A." }],
  (user) => user.id
);
