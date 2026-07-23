import { describe, expect, it } from "bun:test";
import { truncateMiddle } from "./truncateMiddle";

describe("truncateMiddle", () => {
  it("preserves both ends within the maximum length", () => {
    expect(truncateMiddle("abcdefghij", 7)).toBe("abc…hij");
    expect(truncateMiddle("short", 5)).toBe("short");
  });

  it("gives an odd extra character to the start", () => {
    expect(truncateMiddle("abcdefghij", 6, "-")).toBe("abc-ij");
  });

  it("supports empty, custom, and oversized omission markers", () => {
    expect(truncateMiddle("abcdefgh", 4, "")).toBe("abgh");
    expect(truncateMiddle("abcdef", 2, "...")).toBe("..");
    expect(truncateMiddle("abcdef", 1, "👨‍👩‍👧‍👦!")).toBe("👨‍👩‍👧‍👦");
  });

  it("does not split ZWJ emoji or emoji with skin-tone modifiers", () => {
    expect(truncateMiddle("👨‍👩‍👧‍👦abcde👍🏽", 4)).toBe("👨‍👩‍👧‍👦a…👍🏽");
    expect(truncateMiddle("👍🏽👍🏽👍🏽👍🏽", 3)).toBe("👍🏽…👍🏽");
  });

  it("does not split flags or combining-mark sequences", () => {
    expect(truncateMiddle("🇳🇵🇯🇵🇺🇸🇫🇷", 3)).toBe("🇳🇵…🇫🇷");
    expect(truncateMiddle("e\u0301abcde\u0301", 4)).toBe("e\u0301a…e\u0301");
  });

  it("returns an empty string for a zero maximum", () => {
    expect(truncateMiddle("value", 0)).toBe("");
    expect(truncateMiddle("value", 0, "")).toBe("");
    expect(truncateMiddle("", 0)).toBe("");
  });

  it("returns short strings unchanged without normalizing them", () => {
    const decomposed = "e\u0301";
    expect(truncateMiddle(decomposed, 1)).toBe(decomposed);
  });

  it.each([-1, 1.5, Number.NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])(
    "rejects an invalid maximum: %p",
    (maxLength) => {
      expect(() => truncateMiddle("value", maxLength)).toThrow(RangeError);
    }
  );

  it("accepts the largest safe integer", () => {
    expect(truncateMiddle("value", Number.MAX_SAFE_INTEGER)).toBe("value");
  });
});
