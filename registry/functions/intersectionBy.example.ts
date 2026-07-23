import { intersectionBy } from "./intersectionBy";

const shared = intersectionBy(
  [{ id: 1 }, { id: 2 }],
  [[{ id: 2 }]],
  (item) => item.id
);
