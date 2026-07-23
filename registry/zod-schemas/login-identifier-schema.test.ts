import { describe, expect, it } from "bun:test";
import { loginIdentifierSchema } from "./login-identifier-schema";

const messagesFor = (value: unknown): string[] => {
  const result = loginIdentifierSchema.safeParse(value);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
};
const boundaryEmail = (lastLabelLength: 61 | 62): string =>
  `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(lastLabelLength)}`;

describe("loginIdentifierSchema", () => {
  it("trims an email once and preserves its casing", () => {
    expect(loginIdentifierSchema.parse("  Person@Example.COM  ")).toBe(
      "Person@Example.COM",
    );
  });

  it("trims and canonicalizes a username branch", () => {
    expect(loginIdentifierSchema.parse("  User.Name_42  ")).toBe(
      "user.name_42",
    );
  });

  it("uses the same inclusive email and username boundaries", () => {
    const maximumEmail = boundaryEmail(61);
    expect(maximumEmail).toHaveLength(254);
    expect(loginIdentifierSchema.parse(maximumEmail)).toBe(maximumEmail);
    expect(loginIdentifierSchema.parse("ABC")).toBe("abc");
    expect(loginIdentifierSchema.parse("A".repeat(30))).toBe("a".repeat(30));
  });

  it("rejects values beyond either branch's boundary", () => {
    expect(
      loginIdentifierSchema.safeParse(
        boundaryEmail(62),
      ).success,
    ).toBeFalse();
    expect(loginIdentifierSchema.safeParse("a".repeat(31)).success).toBeFalse();
  });

  it.each([
    "",
    "ab",
    "a..b",
    ".abc",
    "abc_",
    "person@",
    "person @example.com",
    "éxample",
    `${"a".repeat(29)}😀`,
  ])("rejects values outside both exact branch policies: %p", (value) => {
    expect(messagesFor(value)).toEqual([
      "Enter a valid email address or username",
    ]);
  });

  it("does not remove internal whitespace", () => {
    expect(loginIdentifierSchema.safeParse("user name").success).toBeFalse();
    expect(
      loginIdentifierSchema.safeParse("person @example.com").success,
    ).toBeFalse();
  });

  it.each([
    { value: null },
    { value: undefined },
    { value: 42 },
    { value: {} },
    { value: [] },
  ])("rejects non-string input before the union: $value", ({ value }) => {
      expect(messagesFor(value)).toEqual([
        "Login identifier must be a string",
      ]);
  });

  it("provides metadata without a registry id", () => {
    expect(loginIdentifierSchema.meta()).toMatchObject({
      title: "Login identifier",
      examples: ["person@example.com", "person_42"],
    });
    expect(loginIdentifierSchema.meta()).not.toHaveProperty("id");
  });
});
