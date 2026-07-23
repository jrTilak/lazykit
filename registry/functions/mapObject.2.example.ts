import { mapObject } from "./mapObject";

const users = {
  alice: { age: 28 },
  bob: { age: 35 },
};

console.log(mapObject(users, (user) => user.age));
// { alice: 28, bob: 35 }
