import { filterObject } from "./filterObject";

const user = { name: "Charlie", age: 28, active: true, role: "editor" };
const textFields = filterObject(user, (value) => typeof value === "string");

console.log(textFields);
// { name: "Charlie", role: "editor" }
