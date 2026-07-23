import { sumBy } from "./sumBy";

const total = sumBy(
  [{ price: 10 }, { price: 15 }],
  (item) => item.price
);
// 25
