import { renameKeys } from "./renameKeys";

const user = {
  firstName: "Alice",
  lastName: "Smith",
  age: 28,
};

const renamedUser = renameKeys(user, [
  { from: "firstName", to: "first_name" },
  { from: "lastName", to: "last_name" },
]);

console.log(renamedUser);
// Output: { age: 28, first_name: "Alice", last_name: "Smith" }
