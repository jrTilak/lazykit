import { unionBy } from "./unionBy";

const users = unionBy(
  [[{ id: 1 }], [{ id: 1 }, { id: 2 }]],
  (user) => user.id
);
