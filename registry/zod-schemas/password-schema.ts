import * as z from "zod";

const DEFAULT_PASSWORD_MIN_LENGTH = 8;
const DEFAULT_PASSWORD_MAX_LENGTH = 128;
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

export interface PasswordSchemaOptions {
  /** Minimum number of Unicode code points. */
  readonly minLength?: number;
  /** Maximum number of Unicode code points. */
  readonly maxLength?: number;
  /**
   * Complete passwords to reject. Entries and inputs are normalized to NFC
   * before an exact, case-sensitive comparison.
   */
  readonly blocklist?: ReadonlySet<string>;
}

interface ValidatedPasswordOptions {
  readonly minLength: number;
  readonly maxLength: number;
  readonly blocklist: ReadonlySet<string>;
}

const validateOptions = (
  options: PasswordSchemaOptions,
): ValidatedPasswordOptions => {
  if (typeof options !== "object" || options === null || Array.isArray(options)) {
    throw new TypeError("options must be a plain object");
  }

  const prototype = Object.getPrototypeOf(options) as unknown;
  if (prototype !== Object.prototype && prototype !== null) {
    throw new TypeError("options must be a plain object");
  }

  for (const key of Reflect.ownKeys(options)) {
    if (
      key !== "minLength" &&
      key !== "maxLength" &&
      key !== "blocklist"
    ) {
      throw new TypeError(`Unknown password option: ${String(key)}`);
    }
  }

  const minLength = Object.hasOwn(options, "minLength")
    ? (options.minLength ?? DEFAULT_PASSWORD_MIN_LENGTH)
    : DEFAULT_PASSWORD_MIN_LENGTH;
  const maxLength = Object.hasOwn(options, "maxLength")
    ? (options.maxLength ?? DEFAULT_PASSWORD_MAX_LENGTH)
    : DEFAULT_PASSWORD_MAX_LENGTH;

  if (!Number.isSafeInteger(minLength) || minLength <= 0) {
    throw new RangeError("options.minLength must be a positive safe integer");
  }
  if (!Number.isSafeInteger(maxLength) || maxLength <= 0) {
    throw new RangeError("options.maxLength must be a positive safe integer");
  }
  if (minLength > maxLength) {
    throw new RangeError(
      "options.minLength must be less than or equal to options.maxLength",
    );
  }

  const blocklist = Object.hasOwn(options, "blocklist")
    ? options.blocklist
    : undefined;
  if (blocklist === undefined) {
    return { minLength, maxLength, blocklist: new Set<string>() };
  }

  if (
    typeof blocklist !== "object" ||
    blocklist === null
  ) {
    throw new TypeError("options.blocklist must be a ReadonlySet of strings");
  }

  const normalizedBlocklist = new Set<string>();
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
      normalizedBlocklist.add(value.normalize("NFC"));
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

  return { minLength, maxLength, blocklist: normalizedBlocklist };
};

/**
 * Creates an NFC-normalized password schema with configurable code-point
 * bounds and an optional full-value blocklist.
 */
export const createPasswordSchema = (options: PasswordSchemaOptions = {}) => {
  const { minLength, maxLength, blocklist } = validateOptions(options);

  return z
    .string({ error: "Password must be a string" })
    .check(
      z.refine(isWellFormedUnicode, {
        error: "Password must contain only well-formed Unicode",
      }),
      z.normalize("NFC"),
      z.refine((value) => codePointLength(value) >= minLength, {
        error: `Password must contain at least ${minLength} characters`,
      }),
      z.refine((value) => codePointLength(value) <= maxLength, {
        error: `Password must contain at most ${maxLength} characters`,
      }),
      z.refine((value) => !blocklist.has(value), {
        error: "Password is blocked",
      }),
    )
    .brand<"ValidatedPassword">()
    .meta({
      title: "Password",
      description: `An NFC-normalized password containing ${minLength} to ${maxLength} Unicode code points.`,
      examples: ["correct horse battery staple"],
    });
};

export const passwordSchema = createPasswordSchema().brand<"Password">();

export type ValidatedPassword = z.infer<
  ReturnType<typeof createPasswordSchema>
>;
export type Password = z.infer<typeof passwordSchema>;
