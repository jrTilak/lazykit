import { describe, expect, it } from "bun:test";
import { displayNameSchema } from "./display-name-schema";

const messagesFor = (value: unknown): string[] => {
  const result = displayNameSchema.safeParse(value);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
};

describe("displayNameSchema", () => {
  it("trims and NFC-normalizes a display name", () => {
    expect(displayNameSchema.parse(" \n Jose\u0301  ")).toBe("José");
  });

  it("accepts the inclusive 1- and 80-code-point boundaries", () => {
    expect(displayNameSchema.parse("A")).toBe("A");
    expect(displayNameSchema.parse("😀".repeat(80))).toBe("😀".repeat(80));
  });

  it("rejects empty and whitespace-only names after trimming", () => {
    expect(messagesFor("")).toContain("Display name is required");
    expect(messagesFor(" \n\t ")).toContain("Display name is required");
  });

  it("rejects more than 80 Unicode code points", () => {
    expect(messagesFor("😀".repeat(81))).toContain(
      "Display name must contain at most 80 characters",
    );
  });

  it("counts after NFC normalization", () => {
    expect(displayNameSchema.parse("e\u0301".repeat(80))).toBe("é".repeat(80));
    expect(messagesFor("e\u0301".repeat(81))).toContain(
      "Display name must contain at most 80 characters",
    );
  });

  it("rejects lone high and low surrogates", () => {
    expect(messagesFor(`Name\uD800`)).toContain(
      "Display name must contain only well-formed Unicode",
    );
    expect(messagesFor(`Name\uDC00`)).toContain(
      "Display name must contain only well-formed Unicode",
    );
  });

  it.each(["Ada\nLovelace", "Ada\tLovelace", "Ada\u0000Lovelace", "Ada\u0085Lovelace"])(
    "rejects C0 and C1 controls in %p",
    (value) => {
      expect(messagesFor(value)).toContain(
        "Display name must not contain control characters",
      );
    },
  );

  it("keeps normal spaces, scripts, punctuation, combining text, and ZWJ emoji", () => {
    expect(displayNameSchema.parse("李 小龍")).toBe("李 小龍");
    expect(displayNameSchema.parse("D'Arcy—Smith")).toBe("D'Arcy—Smith");
    expect(displayNameSchema.parse("Jose\u0301")).toBe("José");
    expect(displayNameSchema.parse("👩‍💻 Developer")).toBe("👩‍💻 Developer");
  });

  it.each([
    { value: null },
    { value: undefined },
    { value: 42 },
    { value: {} },
    { value: [] },
  ])("rejects non-string input: $value", ({ value }) => {
    expect(messagesFor(value)).toEqual(["Display name must be a string"]);
  });

  it("provides metadata without a registry id", () => {
    expect(displayNameSchema.meta()).toMatchObject({
      title: "Display name",
      examples: ["Ada Lovelace"],
    });
    expect(displayNameSchema.meta()).not.toHaveProperty("id");
  });
});
