import * as z from "zod";

const EMAIL_MAX_LENGTH = 254;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;
const USERNAME_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const codePointLength = (value: string): number => Array.from(value).length;

const loginEmailSchema = z
  .email({ error: "Enter a valid email address" })
  .check(
    z.maxLength(EMAIL_MAX_LENGTH, {
      error: `Email must contain at most ${EMAIL_MAX_LENGTH} characters`,
    }),
  )
  .brand<"Email">();

const loginUsernameSchema = z
  .string({ error: "Username must be a string" })
  .check(
    z.toLowerCase(),
    z.normalize("NFC"),
    z.refine(
      (value) => codePointLength(value) >= USERNAME_MIN_LENGTH,
      {
        error: `Username must contain at least ${USERNAME_MIN_LENGTH} characters`,
      },
    ),
    z.refine(
      (value) => codePointLength(value) <= USERNAME_MAX_LENGTH,
      {
        error: `Username must contain at most ${USERNAME_MAX_LENGTH} characters`,
      },
    ),
    z.regex(USERNAME_PATTERN, {
      error:
        "Username must use letters or numbers separated by single dots, underscores, or hyphens",
    }),
  )
  .brand<"Username">();

/**
 * Accepts either the email or canonical username policy after one trim pass.
 */
export const loginIdentifierSchema = z
  .string({ error: "Login identifier must be a string" })
  .check(z.trim())
  .pipe(
    z.union([loginEmailSchema, loginUsernameSchema], {
      error: "Enter a valid email address or username",
    }),
  )
  .meta({
    title: "Login identifier",
    description:
      "A trimmed email address or canonical lowercase username for sign-in.",
    examples: ["person@example.com", "person_42"],
  });

export type LoginIdentifier = z.infer<typeof loginIdentifierSchema>;
