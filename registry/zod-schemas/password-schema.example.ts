import {
  createPasswordSchema,
  passwordSchema,
  type Password,
  type ValidatedPassword,
} from "./password-schema";

const password = passwordSchema.parse("correct horse battery staple");

const savePassword = (value: Password) => {
  console.log(`Accepted ${Array.from(value).length} characters`);
};

savePassword(password);

const pinSchema = createPasswordSchema({
  minLength: 6,
  maxLength: 12,
  blocklist: new Set(["123456"]),
});

const pin: ValidatedPassword = pinSchema.parse("739251");

// Configurable schemas prove validation, but not the default 8–128 policy.
// @ts-expect-error a custom-policy password is not a default Password
savePassword(pin);
