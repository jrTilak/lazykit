import { flattenObject } from "./flattenObject";

const flat = flattenObject({
  user: { name: "Ada", address: { city: "London" } },
  active: true,
});

// {
//   "user.name": "Ada";
//   "user.address.city": "London";
//   active: true;
// }
console.log(flat);
