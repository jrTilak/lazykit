import { describe, expect, it } from "bun:test";
import { escapeRegExp } from "./escapeRegExp";

describe("escapeRegExp", () => {
  it("escapes every regular-expression syntax character", () => {
    const input = "[hello].*+?^${}()|/\\-";
    expect(new RegExp(`^${escapeRegExp(input)}$`).test(input)).toBe(true);
  });

  it("leaves ordinary and Unicode text unchanged", () => {
    expect(escapeRegExp("hello世界")).toBe("hello世界");
  });
});
