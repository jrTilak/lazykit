import { omit } from "./omit";

const originalObject = {
  name: "Alice",
  age: 28,
  city: "Paris",
  occupation: "Engineer",
};

const omittedObject = omit(originalObject, ["age", "occupation"]);

console.log(omittedObject);
// Output: { name: "Alice", city: "Paris" }
