import { differenceBy } from "./differenceBy";

const remaining = differenceBy(
  [{ id: 1 }, { id: 2 }],
  [[{ id: 2 }]],
  (item) => item.id
);
