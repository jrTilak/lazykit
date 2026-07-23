import { unflattenObject } from "./unflattenObject";

const nested = unflattenObject({
  "user.name": "Ada",
  "user.address.city": "London"
});
