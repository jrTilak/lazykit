import {
  passwordConfirmationSchema,
  type PasswordConfirmation,
} from "./password-confirmation-schema";

const values = passwordConfirmationSchema.parse({
  password: "correct horse",
  confirmPassword: "correct horse",
});

const submitPassword = (input: PasswordConfirmation) => {
  console.log(`Confirmed ${Array.from(input.password).length} characters`);
};

submitPassword(values);
