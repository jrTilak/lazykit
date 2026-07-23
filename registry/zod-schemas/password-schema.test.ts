import { describe, expect, it } from "bun:test";
import {
  createPasswordSchema,
  passwordSchema,
  type PasswordSchemaOptions,
} from "./password-schema";

const messagesFor = (value: unknown): string[] => {
  const result = passwordSchema.safeParse(value);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
};

describe("passwordSchema", () => {
  it("accepts the inclusive 8- and 128-code-point boundaries", () => {
    expect(passwordSchema.parse("a".repeat(8))).toBe("a".repeat(8));
    expect(passwordSchema.parse("a".repeat(128))).toBe("a".repeat(128));
  });

  it("rejects values outside the default boundaries", () => {
    expect(messagesFor("a".repeat(7))).toContain(
      "Password must contain at least 8 characters",
    );
    expect(messagesFor("a".repeat(129))).toContain(
      "Password must contain at most 128 characters",
    );
  });

  it("counts Unicode code points rather than UTF-16 code units", () => {
    expect(passwordSchema.parse("😀".repeat(8))).toBe("😀".repeat(8));
    expect(messagesFor("😀".repeat(7))).toContain(
      "Password must contain at least 8 characters",
    );
  });

  it("rejects lone high and low surrogates", () => {
    expect(messagesFor(`${"a".repeat(8)}\uD800`)).toContain(
      "Password must contain only well-formed Unicode",
    );
    expect(messagesFor(`${"a".repeat(8)}\uDC00`)).toContain(
      "Password must contain only well-formed Unicode",
    );
  });

  it("normalizes to NFC before applying the code-point bounds", () => {
    expect(passwordSchema.parse(`e\u0301${"a".repeat(7)}`)).toBe(
      `é${"a".repeat(7)}`,
    );
    expect(messagesFor("e\u0301".repeat(4))).toContain(
      "Password must contain at least 8 characters",
    );
  });

  it("never trims or imposes composition requirements", () => {
    expect(passwordSchema.parse(" abcdef ")).toBe(" abcdef ");
    expect(passwordSchema.parse(" ".repeat(8))).toBe(" ".repeat(8));
  });

  it.each([
    { value: null },
    { value: undefined },
    { value: 42 },
    { value: {} },
    { value: [] },
  ])("rejects non-string input: $value", ({ value }) => {
    expect(messagesFor(value)).toEqual(["Password must be a string"]);
  });

  it("provides metadata without a registry id", () => {
    expect(passwordSchema.meta()).toMatchObject({
      title: "Password",
      examples: ["correct horse battery staple"],
    });
    expect(passwordSchema.meta()).not.toHaveProperty("id");
  });
});

describe("createPasswordSchema", () => {
  it("applies custom inclusive code-point boundaries", () => {
    const schema = createPasswordSchema({ minLength: 2, maxLength: 3 });
    expect(schema.parse("😀😀")).toBe("😀😀");
    expect(schema.parse("abc")).toBe("abc");
    expect(schema.safeParse("a").success).toBeFalse();
    expect(schema.safeParse("abcd").success).toBeFalse();
  });

  it("normalizes blocklist entries and compares the complete value", () => {
    const blocked = `e\u0301${"a".repeat(7)}`;
    const schema = createPasswordSchema({
      blocklist: new Set([blocked]),
    });

    const result = schema.safeParse(`é${"a".repeat(7)}`);
    expect(result.success).toBeFalse();
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({ message: "Password is blocked" }),
      );
    }

    expect(schema.safeParse(`${blocked}b`).success).toBeTrue();
    expect(schema.safeParse(blocked.toUpperCase()).success).toBeTrue();
  });

  it("snapshots a blocklist when the schema is created", () => {
    const values = new Set<string>();
    const schema = createPasswordSchema({ blocklist: values });
    values.add("newly blocked");
    expect(schema.safeParse("newly blocked").success).toBeTrue();
  });

  it("accepts a null-prototype options object", () => {
    const options = Object.assign(Object.create(null) as PasswordSchemaOptions, {
      minLength: 2,
      maxLength: 4,
    });
    expect(createPasswordSchema(options).parse("abc")).toBe("abc");
  });

  it("ignores proxy values for options that are not own properties", () => {
    const reads: PropertyKey[] = [];
    const options = new Proxy(
      {},
      {
        get(_target, key) {
          reads.push(key);
          if (key === "minLength" || key === "maxLength") return 1;
          if (key === "blocklist") return new Set(["a".repeat(8)]);
          return undefined;
        },
      },
    ) as PasswordSchemaOptions;

    const schema = createPasswordSchema(options);

    expect(reads).toEqual([]);
    expect(schema.safeParse("a".repeat(7)).success).toBeFalse();
    expect(schema.safeParse("a".repeat(8)).success).toBeTrue();
  });

  it.each([
    { value: null },
    { value: [] },
    { value: new Date() },
    { value: () => undefined },
  ])("rejects a non-plain options value: $value", ({ value }) => {
    expect(() =>
      createPasswordSchema(value as unknown as PasswordSchemaOptions),
    ).toThrow("options must be a plain object");
  });

  it("rejects unknown string and symbol option keys", () => {
    expect(() =>
      createPasswordSchema({ typo: true } as unknown as PasswordSchemaOptions),
    ).toThrow("Unknown password option: typo");

    const key = Symbol("typo");
    expect(() =>
      createPasswordSchema({
        [key]: true,
      } as unknown as PasswordSchemaOptions),
    ).toThrow("Unknown password option: Symbol(typo)");
  });

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, 2 ** 53])(
    "rejects invalid minimum %p",
    (minLength) => {
      expect(() => createPasswordSchema({ minLength })).toThrow(
        "options.minLength must be a positive safe integer",
      );
    },
  );

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, 2 ** 53])(
    "rejects invalid maximum %p",
    (maxLength) => {
      expect(() => createPasswordSchema({ maxLength })).toThrow(
        "options.maxLength must be a positive safe integer",
      );
    },
  );

  it("rejects reversed boundaries", () => {
    expect(() =>
      createPasswordSchema({ minLength: 9, maxLength: 8 }),
    ).toThrow(
      "options.minLength must be less than or equal to options.maxLength",
    );
  });

  it.each([
    { value: null },
    { value: [] },
    { value: new Map() },
    { value: { size: 0, has: () => false } },
  ])("rejects an invalid blocklist: $value", ({ value }) => {
    expect(() =>
      createPasswordSchema({
        blocklist: value as unknown as ReadonlySet<string>,
      }),
    ).toThrow("options.blocklist must be a ReadonlySet of strings");
  });

  it("rejects non-string blocklist entries", () => {
    expect(() =>
      createPasswordSchema({
        blocklist: new Set([1]) as unknown as ReadonlySet<string>,
      }),
    ).toThrow("options.blocklist must contain only string values");
  });

  it("rejects ill-formed Unicode blocklist entries", () => {
    expect(() =>
      createPasswordSchema({
        blocklist: new Set([`${"a".repeat(8)}\uD800`]),
      }),
    ).toThrow(
      "options.blocklist must contain only well-formed Unicode strings",
    );
  });

  it("wraps blocklist iteration failures", () => {
    const blocklist = {
      size: 1,
      has: () => false,
      *[Symbol.iterator](): IterableIterator<string> {
        throw new Error("iteration failed");
      },
    };

    expect(() => createPasswordSchema({ blocklist })).toThrow(
      "options.blocklist must be a ReadonlySet of strings",
    );
  });
});
