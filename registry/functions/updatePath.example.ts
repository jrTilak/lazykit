import { updatePath } from "./updatePath";

const next = updatePath(
  { cart: { count: 2 } },
  "cart.count",
  (count) => Number(count) + 1
);
