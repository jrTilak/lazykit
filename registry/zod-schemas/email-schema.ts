import * as z from "zod";

const EMAIL_MAX_LENGTH = 254;

/** Validates and brands a trimmed email address without changing its casing. */
export const emailSchema = z
  .string({ error: "Email must be a string" })
  .check(z.trim())
  .pipe(
    z
      .email({ error: "Enter a valid email address" })
      .check(
        z.maxLength(EMAIL_MAX_LENGTH, {
          error: `Email must contain at most ${EMAIL_MAX_LENGTH} characters`,
        }),
      ),
  )
  .brand<"Email">()
  .meta({
    title: "Email",
    description:
      "A trimmed email address with its original letter casing preserved.",
    examples: ["person@example.com"],
  });

export type Email = z.infer<typeof emailSchema>;
