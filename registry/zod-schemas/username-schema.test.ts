import { describe, expect, it } from "bun:test";
import { usernameSchema } from "./username-schema";

const issuesFor = (value: unknown) => {
  const result = usernameSchema.safeParse(value);
  return result.success ? [] : result.error.issues;
};

const messagesFor = (value: unknown): string[] =>
  issuesFor(value).map((issue) => issue.message);

describe("usernameSchema", () => {
  it("trims, lowercases, and emits the canonical username", () => {
    expect(usernameSchema.parse(" \n User.Name_42 \t")).toBe("user.name_42");
  });

  it("accepts the inclusive 3- and 30-code-point boundaries", () => {
    expect(usernameSchema.parse("ABC")).toBe("abc");
    expect(usernameSchema.parse("A".repeat(30))).toBe("a".repeat(30));
  });

  it("rejects values outside the length boundaries", () => {
    expect(messagesFor("ab")).toContain(
      "Username must contain at least 3 characters",
    );
    expect(messagesFor("a".repeat(31))).toContain(
      "Username must contain at most 30 characters",
    );
  });

  it.each([
    ".abc",
    "abc.",
    "_abc",
    "abc-",
    "a..b",
    "a_-b",
    "a--b",
    "a. _b",
  ])("rejects leading, trailing, repeated, or spaced separators: %p", (value) => {
    expect(messagesFor(value)).toContain(
      "Username must use letters or numbers separated by single dots, underscores, or hyphens",
    );
  });

  it("allows each separator only between alphanumeric groups", () => {
    expect(usernameSchema.parse("alpha.beta_gamma-delta")).toBe(
      "alpha.beta_gamma-delta",
    );
  });

  it("does not compatibility-fold or admit non-ASCII text", () => {
    expect(usernameSchema.safeParse("ＦＯＯ")).toMatchObject({ success: false });
    expect(usernameSchema.safeParse("e\u0301x")).toMatchObject({
      success: false,
    });
    expect(usernameSchema.safeParse("éx")).toMatchObject({ success: false });
  });

  it("counts astral input as code points before reporting the ASCII policy", () => {
    const withinMaximum = `${"a".repeat(29)}😀`;
    const withinIssues = issuesFor(withinMaximum);
    expect(withinIssues.map((issue) => issue.message)).not.toContain(
      "Username must contain at most 30 characters",
    );
    expect(withinIssues.map((issue) => issue.message)).toContain(
      "Username must use letters or numbers separated by single dots, underscores, or hyphens",
    );

    expect(messagesFor(`${"a".repeat(30)}😀`)).toContain(
      "Username must contain at most 30 characters",
    );
  });

  it.each([
    { value: null },
    { value: undefined },
    { value: 1 },
    { value: {} },
    { value: [] },
  ])("rejects non-string input: $value", ({ value }) => {
      expect(messagesFor(value)).toEqual(["Username must be a string"]);
  });

  it("provides metadata without a registry id", () => {
    expect(usernameSchema.meta()).toMatchObject({
      title: "Username",
      examples: ["person_42"],
    });
    expect(usernameSchema.meta()).not.toHaveProperty("id");
  });
});
