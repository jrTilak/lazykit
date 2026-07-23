import { describe, expect, it } from "bun:test";
import { truncate } from "./truncate";

describe("truncate", () => {
  it("includes the omission marker in the maximum length", () => {
    expect(truncate("Hello world", 8)).toBe("Hello w…");
    expect(truncate("Hello world", 11)).toBe("Hello world");
  });

  it("supports empty, custom, and oversized omission markers", () => {
    expect(truncate("abcdef", 3, "")).toBe("abc");
    expect(truncate("abcdef", 5, "...")).toBe("ab...");
    expect(truncate("abcdef", 2, "...")).toBe("..");
    expect(truncate("abcdef", 1, "👨‍👩‍👧‍👦!")).toBe("👨‍👩‍👧‍👦");
  });

  it("does not split ZWJ emoji or emoji with skin-tone modifiers", () => {
    expect(truncate("👨‍👩‍👧‍👦 family", 3)).toBe("👨‍👩‍👧‍👦 …");
    expect(truncate("👍🏽👍🏽👍🏽", 2)).toBe("👍🏽…");
  });

  it("does not split flags or combining-mark sequences", () => {
    expect(truncate("🇳🇵🇯🇵🇺🇸", 2)).toBe("🇳🇵…");
    expect(truncate("e\u0301e\u0301e\u0301", 2)).toBe("e\u0301…");
  });

  it("returns an empty string for a zero maximum", () => {
    expect(truncate("value", 0)).toBe("");
    expect(truncate("value", 0, "")).toBe("");
    expect(truncate("", 0)).toBe("");
  });

  it("returns short strings unchanged without normalizing them", () => {
    const decomposed = "e\u0301";
    expect(truncate(decomposed, 1)).toBe(decomposed);
    expect(truncate("short", 5)).toBe("short");
  });

  it.each([-1, 1.5, Number.NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])(
    "rejects an invalid maximum: %p",
    (maxLength) => {
      expect(() => truncate("value", maxLength)).toThrow(RangeError);
    }
  );

  it("accepts the largest safe integer", () => {
    expect(truncate("value", Number.MAX_SAFE_INTEGER)).toBe("value");
  });

  it("validates length before returning an unchanged value", () => {
    expect(() => truncate("value", -1)).toThrow(RangeError);
  });
});
