import { describe, expect, it } from "bun:test";
import { slugSchema } from "./slug-schema";

describe("slugSchema", () => {
  it("accepts canonical slugs without changing them", () => {
    for (const value of [
      "a",
      "release-notes",
      "zod-4",
      "2026",
      "a1-b2-c3",
    ]) {
      expect(slugSchema.parse(value)).toBe(value);
    }
  });

  it("canonicalizes casing, whitespace, punctuation, and separators", () => {
    const cases = [
      ["  Hello, World!  ", "hello-world"],
      ["already--separated", "already-separated"],
      ["snake_case/value", "snake-case-value"],
      ["Mixed.CASE + words", "mixed-case-words"],
      ["---edge separators---", "edge-separators"],
    ] as const;

    for (const [input, expected] of cases) {
      expect(slugSchema.parse(input)).toBe(expected);
    }
  });

  it("removes decomposed accents before applying the ASCII policy", () => {
    expect(slugSchema.parse("Crème Brûlée")).toBe("creme-brulee");
    expect(slugSchema.parse("Cafe\u0301 Society")).toBe("cafe-society");
  });

  it("accepts ordinary outer spaces and well-formed surrogate pairs", () => {
    expect(slugSchema.parse("  hello world  ")).toBe("hello-world");
    expect(slugSchema.parse("hello😀world")).toBe("hello-world");
  });

  it("rejects lone surrogates before canonicalization", () => {
    for (const value of [
      `hello\uD800world`,
      `hello\uDC00world`,
      `\uD800hello`,
      `hello\uDC00`,
    ]) {
      const result = slugSchema.safeParse(value);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0]?.message).toBe(
          "Slug input must contain only well-formed Unicode.",
        );
      }
    }
  });

  it("rejects C0 and C1 controls before canonicalization", () => {
    for (const value of [
      "\nhello",
      "hello\tworld",
      "hello\u0000world",
      "hello\u007fworld",
      "hello\u0085world",
      "hello\r",
    ]) {
      const result = slugSchema.safeParse(value);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0]?.message).toBe(
          "Slug input must not contain control characters.",
        );
      }
    }
  });

  it("accepts canonical output at the 100-character boundary", () => {
    const value = "a".repeat(100);

    expect(slugSchema.parse(value)).toBe(value);
  });

  it("rejects canonical output longer than 100 characters", () => {
    const result = slugSchema.safeParse("a".repeat(101));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(1);
      expect(result.error.issues[0]?.message).toBe(
        "Slug must be at most 100 characters.",
      );
    }
  });

  it("rejects inputs that contain no ASCII letter or number after canonicalization", () => {
    for (const value of ["", "   ", "---", "💤", "你好"]) {
      const result = slugSchema.safeParse(value);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0]?.message).toBe(
          "Slug must contain at least one letter or number.",
        );
      }
    }
  });

  it("rejects non-string inputs before canonicalization", () => {
    for (const value of [undefined, null, 42, true, {}, []]) {
      const result = slugSchema.safeParse(value);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0]?.message).toBe(
          "Slug input must be a string.",
        );
      }
    }
  });

  it("does not mutate the source string", () => {
    const input = "  Keep This Input  ";

    expect(slugSchema.parse(input)).toBe("keep-this-input");
    expect(input).toBe("  Keep This Input  ");
  });

  it("exposes metadata without registering a global id", () => {
    expect(slugSchema.meta()).toEqual({
      title: "Slug",
      description:
        "A canonical lowercase URL slug containing ASCII letters, numbers, and single hyphens.",
      examples: ["introducing-zod-4", "release-notes-2026"],
    });
    expect(slugSchema.meta()?.id).toBeUndefined();
  });
});
