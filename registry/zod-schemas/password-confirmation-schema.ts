import * as z from "zod";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const codePointLength = (value: string): number => Array.from(value).length;
const isWellFormedUnicode = (value: string): boolean => {
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const nextCodeUnit = value.charCodeAt(index + 1);
      if (!(nextCodeUnit >= 0xdc00 && nextCodeUnit <= 0xdfff)) return false;
      index += 1;
    } else if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) {
      return false;
    }
  }
  return true;
};

/**
 * Applies one string-output schema to a password and its confirmation, then
 * reports mismatches on the confirmation field.
 */
export const createPasswordConfirmationSchema = <
  const Schema extends z.ZodType<string>,
>(
  schema: Schema,
) =>
  z
    .object({
      password: schema,
      confirmPassword: schema,
    })
    .check(
      z.refine(
        (value) => {
          const fields = value as {
            password: z.output<Schema>;
            confirmPassword: z.output<Schema>;
          };
          return fields.password === fields.confirmPassword;
        },
        {
          error: "Passwords do not match",
          path: ["confirmPassword"],
        },
      ),
    )
    .brand<"PasswordConfirmation">()
    .meta({
      title: "Password confirmation",
      description:
        "A password and confirmation validated by the same schema and required to match.",
    });

const confirmationPasswordValueSchema = z
  .string({ error: "Password must be a string" })
  .check(
    z.refine(isWellFormedUnicode, {
      error: "Password must contain only well-formed Unicode",
    }),
    z.normalize("NFC"),
    z.refine(
      (value) => codePointLength(value) >= PASSWORD_MIN_LENGTH,
      {
        error: `Password must contain at least ${PASSWORD_MIN_LENGTH} characters`,
      },
    ),
    z.refine(
      (value) => codePointLength(value) <= PASSWORD_MAX_LENGTH,
      {
        error: `Password must contain at most ${PASSWORD_MAX_LENGTH} characters`,
      },
    ),
  )
  .brand<"ValidatedPassword">()
  .brand<"Password">();

export const passwordConfirmationSchema =
  createPasswordConfirmationSchema(confirmationPasswordValueSchema);

export type PasswordConfirmation = z.infer<
  typeof passwordConfirmationSchema
>;
