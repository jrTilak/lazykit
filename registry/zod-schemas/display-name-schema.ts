import * as z from "zod";

const DISPLAY_NAME_MIN_LENGTH = 1;
const DISPLAY_NAME_MAX_LENGTH = 80;
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f-\u009f]/u;
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

/** Validates and brands a trimmed, NFC-normalized display name. */
export const displayNameSchema = z
  .string({ error: "Display name must be a string" })
  .check(
    z.trim(),
    z.refine(isWellFormedUnicode, {
      error: "Display name must contain only well-formed Unicode",
    }),
    z.normalize("NFC"),
    z.refine((value) => !CONTROL_CHARACTER_PATTERN.test(value), {
      error: "Display name must not contain control characters",
    }),
    z.refine(
      (value) => codePointLength(value) >= DISPLAY_NAME_MIN_LENGTH,
      { error: "Display name is required" },
    ),
    z.refine(
      (value) => codePointLength(value) <= DISPLAY_NAME_MAX_LENGTH,
      {
        error: `Display name must contain at most ${DISPLAY_NAME_MAX_LENGTH} characters`,
      },
    ),
  )
  .brand<"DisplayName">()
  .meta({
    title: "Display name",
    description:
      "A trimmed, NFC-normalized display name containing at most 80 Unicode code points.",
    examples: ["Ada Lovelace"],
  });

export type DisplayName = z.infer<typeof displayNameSchema>;
