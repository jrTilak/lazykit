import {
  displayNameSchema,
  type DisplayName,
} from "./display-name-schema";

const displayName = displayNameSchema.parse("  Ada Lovelace  ");

const greet = (name: DisplayName) => {
  console.log(`Hello, ${name}`);
};

greet(displayName);
// Output: Hello, Ada Lovelace
