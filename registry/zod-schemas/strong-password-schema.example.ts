import {
  createStrongPasswordSchema,
  strongPasswordSchema,
  type StrongPassword,
} from "./strong-password-schema";

const password = strongPasswordSchema.parse(
  "correct horse battery staple",
);

const acceptStrongPassword = (value: StrongPassword) => {
  console.log(`Accepted ${Array.from(value).length} characters`);
};

acceptStrongPassword(password);

const teamPasswordSchema = createStrongPasswordSchema({
  blocklist: new Set(["correct horse battery staple"]),
});

teamPasswordSchema.safeParse("correct horse battery staple");
