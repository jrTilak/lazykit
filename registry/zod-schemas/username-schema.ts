import * as z from "zod";

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;
const USERNAME_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const codePointLength = (value: string): number => Array.from(value).length;

/**
 * Validates and brands a canonical lowercase username.
 *
 * Usernames contain ASCII letters, numbers, and single dot, underscore, or
 * hyphen separators between alphanumeric groups.
 */
export const usernameSchema = z
  .string({ error: "Username must be a string" })
  .check(
    z.trim(),
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
  .brand<"Username">()
  .meta({
    title: "Username",
    description:
      "A canonical lowercase username containing 3 to 30 ASCII characters.",
    examples: ["person_42"],
  });

export type Username = z.infer<typeof usernameSchema>;
