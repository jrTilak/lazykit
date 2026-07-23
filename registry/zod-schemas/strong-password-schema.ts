import * as z from "zod";

const STRONG_PASSWORD_MIN_LENGTH = 15;
const STRONG_PASSWORD_MAX_LENGTH = 128;
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

export interface StrongPasswordSchemaOptions {
  /**
   * Complete passwords to reject. Entries and inputs are normalized to NFC
   * before an exact, case-sensitive comparison.
   */
  readonly blocklist?: ReadonlySet<string>;
}

const normalizeBlocklist = (
  options: StrongPasswordSchemaOptions,
): ReadonlySet<string> => {
  if (typeof options !== "object" || options === null || Array.isArray(options)) {
    throw new TypeError("options must be a plain object");
  }

  const prototype = Object.getPrototypeOf(options) as unknown;
  if (prototype !== Object.prototype && prototype !== null) {
    throw new TypeError("options must be a plain object");
  }

  for (const key of Reflect.ownKeys(options)) {
    if (key !== "blocklist") {
      throw new TypeError(`Unknown strong password option: ${String(key)}`);
    }
  }

  const blocklist = Object.hasOwn(options, "blocklist")
    ? options.blocklist
    : undefined;
  if (blocklist === undefined) return new Set<string>();

  if (
    typeof blocklist !== "object" ||
    blocklist === null
  ) {
    throw new TypeError("options.blocklist must be a ReadonlySet of strings");
  }

  const normalized = new Set<string>();
  let values: IterableIterator<unknown>;
  try {
    values = Set.prototype.values.call(blocklist as Set<unknown>);
  } catch (error) {
    throw new TypeError("options.blocklist must be a ReadonlySet of strings", {
      cause: error,
    });
  }

  try {
    for (const value of values) {
      if (typeof value !== "string") {
        throw new TypeError(
          "options.blocklist must contain only string values",
        );
      }
      if (!isWellFormedUnicode(value)) {
        throw new TypeError(
          "options.blocklist must contain only well-formed Unicode strings",
        );
      }
      normalized.add(value.normalize("NFC"));
    }
  } catch (error) {
    if (
      error instanceof TypeError &&
      (error.message === "options.blocklist must contain only string values" ||
        error.message ===
          "options.blocklist must contain only well-formed Unicode strings")
    ) {
      throw error;
    }
    throw new TypeError("options.blocklist must be a ReadonlySet of strings", {
      cause: error,
    });
  }

  return normalized;
};

/**
 * Creates an NFC-normalized strong-password schema with an optional blocklist.
 */
export const createStrongPasswordSchema = (
  options: StrongPasswordSchemaOptions = {},
) => {
  const blocklist = normalizeBlocklist(options);

  return z
    .string({ error: "Strong password must be a string" })
    .check(
      z.refine(isWellFormedUnicode, {
        error: "Strong password must contain only well-formed Unicode",
      }),
      z.normalize("NFC"),
      z.refine(
        (value) => codePointLength(value) >= STRONG_PASSWORD_MIN_LENGTH,
        {
          error: `Strong password must contain at least ${STRONG_PASSWORD_MIN_LENGTH} characters`,
        },
      ),
      z.refine(
        (value) => codePointLength(value) <= STRONG_PASSWORD_MAX_LENGTH,
        {
          error: `Strong password must contain at most ${STRONG_PASSWORD_MAX_LENGTH} characters`,
        },
      ),
      z.refine((value) => !blocklist.has(value), {
        error: "Strong password is blocked",
      }),
    )
    .brand<"ValidatedPassword">()
    .brand<"Password">()
    .brand<"StrongPassword">()
    .meta({
      title: "Strong password",
      description:
        "An NFC-normalized password containing 15 to 128 Unicode code points.",
      examples: ["correct horse battery staple"],
    });
};

export const strongPasswordSchema = createStrongPasswordSchema();

export type StrongPassword = z.infer<typeof strongPasswordSchema>;
