import {
  loginIdentifierSchema,
  type LoginIdentifier,
} from "./login-identifier-schema";

const identifier = loginIdentifierSchema.parse("  Person_42  ");

const startLogin = (value: LoginIdentifier) => {
  console.log(`Signing in as ${value}`);
};

startLogin(identifier);
// Output: Signing in as person_42
