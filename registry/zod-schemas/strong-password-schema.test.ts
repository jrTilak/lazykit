import { describe, expect, it } from "bun:test";
import {
  createStrongPasswordSchema,
  strongPasswordSchema,
  type StrongPasswordSchemaOptions,
} from "./strong-password-schema";

const messagesFor = (value: unknown): string[] => {
  const result = strongPasswordSchema.safeParse(value);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
};

describe("strongPasswordSchema", () => {
  it("accepts the inclusive 15- and 128-code-point boundaries", () => {
    expect(strongPasswordSchema.parse("a".repeat(15))).toBe("a".repeat(15));
    expect(strongPasswordSchema.parse("a".repeat(128))).toBe("a".repeat(128));
  });

  it("rejects values outside its boundaries", () => {
    expect(messagesFor("a".repeat(14))).toContain(
      "Strong password must contain at least 15 characters",
    );
    expect(messagesFor("a".repeat(129))).toContain(
      "Strong password must contain at most 128 characters",
    );
  });

  it("counts astral code points rather than UTF-16 code units", () => {
    expect(strongPasswordSchema.parse("😀".repeat(15))).toBe("😀".repeat(15));
    expect(messagesFor("😀".repeat(14))).toContain(
      "Strong password must contain at least 15 characters",
    );
  });

  it("rejects lone high and low surrogates", () => {
    expect(messagesFor(`${"a".repeat(15)}\uD800`)).toContain(
      "Strong password must contain only well-formed Unicode",
    );
    expect(messagesFor(`${"a".repeat(15)}\uDC00`)).toContain(
      "Strong password must contain only well-formed Unicode",
    );
  });

  it("normalizes to NFC before applying the length policy", () => {
    expect(
      strongPasswordSchema.parse(`e\u0301${"a".repeat(14)}`),
    ).toBe(`é${"a".repeat(14)}`);
    expect(messagesFor("e\u0301".repeat(7))).toContain(
      "Strong password must contain at least 15 characters",
    );
  });

  it("does not trim or require character classes", () => {
    expect(strongPasswordSchema.parse(" ".repeat(15))).toBe(" ".repeat(15));
    expect(strongPasswordSchema.parse("lowercaseonlyyy")).toBe(
      "lowercaseonlyyy",
    );
  });

  it.each([
    { value: null },
    { value: undefined },
    { value: 42 },
    { value: {} },
    { value: [] },
  ])("rejects non-string input: $value", ({ value }) => {
    expect(messagesFor(value)).toEqual(["Strong password must be a string"]);
  });

  it("provides metadata without a registry id", () => {
    expect(strongPasswordSchema.meta()).toMatchObject({
      title: "Strong password",
      examples: ["correct horse battery staple"],
    });
    expect(strongPasswordSchema.meta()).not.toHaveProperty("id");
  });
});

describe("createStrongPasswordSchema", () => {
  it("normalizes blocklist entries for full-value comparison", () => {
    const blocked = `e\u0301${"a".repeat(14)}`;
    const schema = createStrongPasswordSchema({
      blocklist: new Set([blocked]),
    });

    const result = schema.safeParse(`é${"a".repeat(14)}`);
    expect(result.success).toBeFalse();
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({ message: "Strong password is blocked" }),
      );
    }

    expect(schema.safeParse(`${blocked}b`).success).toBeTrue();
    expect(schema.safeParse(blocked.toUpperCase()).success).toBeTrue();
  });

  it("snapshots a blocklist when creating the schema", () => {
    const values = new Set<string>();
    const schema = createStrongPasswordSchema({ blocklist: values });
    values.add("a".repeat(15));
    expect(schema.safeParse("a".repeat(15)).success).toBeTrue();
  });

  it("accepts a null-prototype options object", () => {
    const options = Object.assign(
      Object.create(null) as StrongPasswordSchemaOptions,
      { blocklist: new Set<string>() },
    );
    expect(createStrongPasswordSchema(options).parse("a".repeat(15))).toBe(
      "a".repeat(15),
    );
  });

  it("ignores a proxy blocklist value that is not an own property", () => {
    const reads: PropertyKey[] = [];
    const options = new Proxy(
      {},
      {
        get(_target, key) {
          reads.push(key);
          if (key === "blocklist") return new Set(["a".repeat(15)]);
          return undefined;
        },
      },
    ) as StrongPasswordSchemaOptions;

    const schema = createStrongPasswordSchema(options);

    expect(reads).toEqual([]);
    expect(schema.safeParse("a".repeat(15)).success).toBeTrue();
  });

  it.each([
    { value: null },
    { value: [] },
    { value: new Date() },
    { value: () => undefined },
  ])("rejects a non-plain options value: $value", ({ value }) => {
    expect(() =>
      createStrongPasswordSchema(
        value as unknown as StrongPasswordSchemaOptions,
      ),
    ).toThrow("options must be a plain object");
  });

  it("rejects unknown string and symbol option keys", () => {
    expect(() =>
      createStrongPasswordSchema({
        typo: true,
      } as unknown as StrongPasswordSchemaOptions),
    ).toThrow("Unknown strong password option: typo");

    const key = Symbol("typo");
    expect(() =>
      createStrongPasswordSchema({
        [key]: true,
      } as unknown as StrongPasswordSchemaOptions),
    ).toThrow("Unknown strong password option: Symbol(typo)");
  });

  it.each([
    { value: null },
    { value: [] },
    { value: new Map() },
    { value: { size: 0, has: () => false } },
  ])("rejects an invalid blocklist: $value", ({ value }) => {
    expect(() =>
      createStrongPasswordSchema({
        blocklist: value as unknown as ReadonlySet<string>,
      }),
    ).toThrow("options.blocklist must be a ReadonlySet of strings");
  });

  it("rejects non-string blocklist entries", () => {
    expect(() =>
      createStrongPasswordSchema({
        blocklist: new Set([1]) as unknown as ReadonlySet<string>,
      }),
    ).toThrow("options.blocklist must contain only string values");
  });

  it("rejects ill-formed Unicode blocklist entries", () => {
    expect(() =>
      createStrongPasswordSchema({
        blocklist: new Set([`${"a".repeat(15)}\uDC00`]),
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

    expect(() => createStrongPasswordSchema({ blocklist })).toThrow(
      "options.blocklist must be a ReadonlySet of strings",
    );
  });
});
