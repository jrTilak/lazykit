import { keyBy } from "./keyBy";

const usersById = keyBy(
  [{ id: "ada", active: true }, { id: "lin", active: false }],
  (user) => user.id
);
