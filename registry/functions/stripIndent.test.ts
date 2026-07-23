import { describe, expect, it } from "bun:test";
import { stripIndent } from "./stripIndent";

describe("stripIndent", () => {
  it("removes shared indentation from template-style text", () => {
    expect(stripIndent(`
      first
        second
      third
    `)).toBe("first\n  second\nthird");
  });

  it("normalizes line endings and ignores blank lines when measuring", () => {
    expect(stripIndent("  one\r\n\r\n    two")).toBe("one\n\n  two");
  });

  it("handles empty and unindented input", () => {
    expect(stripIndent("")).toBe("");
    expect(stripIndent("one\n  two")).toBe("one\n  two");
  });
});
