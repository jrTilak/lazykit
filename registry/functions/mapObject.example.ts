import { mapObject } from "./mapObject";

const prices = { apple: 2, pear: 3 };
const labels = mapObject(prices, (price, fruit) => `${fruit}: $${price}`);

console.log(labels);
// { apple: "apple: $2", pear: "pear: $3" }
