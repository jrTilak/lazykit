import { describe, expect, it } from "bun:test";
import { emailSchema } from "./email-schema";

const messagesFor = (value: unknown): string[] => {
  const result = emailSchema.safeParse(value);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
};
const boundaryEmail = (lastLabelLength: 61 | 62): string =>
  `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(lastLabelLength)}`;

describe("emailSchema", () => {
  it("trims surrounding whitespace without lowercasing", () => {
    expect(emailSchema.parse("  Person@Example.COM \n")).toBe(
      "Person@Example.COM",
    );
  });

  it("accepts the 254-character boundary after trimming", () => {
    const email = boundaryEmail(61);
    expect(email).toHaveLength(254);
    expect(emailSchema.parse(` ${email} `)).toBe(email);
  });

  it("rejects an email longer than 254 characters", () => {
    const email = boundaryEmail(62);
    expect(email).toHaveLength(255);
    expect(messagesFor(email)).toContain(
      "Email must contain at most 254 characters",
    );
  });

  it.each([
    "",
    "   ",
    "person",
    "@example.com",
    "person@",
    "person @example.com",
    "person@example.com trailing",
  ])("rejects invalid email syntax: %p", (value) => {
    expect(messagesFor(value)).toContain("Enter a valid email address");
  });

  it.each([
    { value: null },
    { value: undefined },
    { value: 42 },
    { value: {} },
    { value: [] },
  ])("rejects non-string input: $value", ({ value }) => {
      expect(messagesFor(value)).toEqual(["Email must be a string"]);
  });

  it("provides metadata without a registry id", () => {
    expect(emailSchema.meta()).toMatchObject({
      title: "Email",
      examples: ["person@example.com"],
    });
    expect(emailSchema.meta()).not.toHaveProperty("id");
  });
});
