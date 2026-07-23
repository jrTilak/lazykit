import { minBy } from "./minBy";

const cheapest = minBy(
  [{ name: "A", price: 20 }, { name: "B", price: 12 }],
  (item) => item.price
);
