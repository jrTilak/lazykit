import { describe, expect, it } from "bun:test";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("normalizes accents, casing, punctuation, and surrounding separators", () => {
    expect(slugify("  Déjà Vu! A Guide  ")).toBe("deja-vu-a-guide");
  });

  it("supports Unicode letters and custom separators", () => {
    expect(slugify("नमस्ते संसार")).toBe("नमस्ते-संसार");
    expect(slugify("hello world", "_")).toBe("hello_world");
  });

  it("rejects empty and alphanumeric separators", () => {
    expect(() => slugify("hello", "")).toThrow(TypeError);
    expect(() => slugify("hello", "a")).toThrow(TypeError);
  });
});
