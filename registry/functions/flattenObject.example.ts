import { flattenObject } from "./flattenObject";

const flat = flattenObject({
  user: { name: "Ada", address: { city: "London" } }
});
