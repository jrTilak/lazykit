import { unflattenObject } from "./unflattenObject";

const nested = unflattenObject({
  "user.name": "Ada",
  "user.address.city": "London",
  active: true,
});

// {
//   user: { name: "Ada"; address: { city: "London" } };
//   active: true;
// }
console.log(nested);
