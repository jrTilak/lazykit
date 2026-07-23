import * as z from "zod";

const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f-\u009f]/u;
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

const canonicalizeSlug = (value: string): string =>
  value
    .trim()
    .normalize("NFKD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Canonicalizes text into a validated, branded URL slug. */
export const slugSchema = z
  .string({ error: "Slug input must be a string." })
  .check(
    z.refine(isWellFormedUnicode, {
      error: "Slug input must contain only well-formed Unicode.",
      abort: true,
    }),
    z.refine((value) => !CONTROL_CHARACTER_PATTERN.test(value), {
      error: "Slug input must not contain control characters.",
      abort: true,
    }),
  )
  .transform(canonicalizeSlug)
  .pipe(
    z
      .string()
      .min(1, {
        error: "Slug must contain at least one letter or number.",
        abort: true,
      })
      .max(100, {
        error: "Slug must be at most 100 characters.",
      })
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        error:
          "Slug must contain lowercase letters and numbers separated by single hyphens.",
      })
      .brand<"Slug">(),
  )
  .meta({
    title: "Slug",
    description:
      "A canonical lowercase URL slug containing ASCII letters, numbers, and single hyphens.",
    examples: ["introducing-zod-4", "release-notes-2026"],
  });

export type Slug = z.infer<typeof slugSchema>;
