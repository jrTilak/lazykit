import { describe, expect, it } from "bun:test";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("normalizes accents, casing, punctuation, and surrounding separators", () => {
    expect(slugify("  Déjà Vu! A Guide  ")).toBe("deja-vu-a-guide");
    expect(slugify("Crème brûlée déjà vu")).toBe("creme-brulee-deja-vu");
    expect(slugify("Ḗxample")).toBe("example");
    expect(slugify("---Hello---")).toBe("hello");
  });

  it("retains Unicode letters and combining marks outside Latin text", () => {
    expect(slugify("नमस्ते संसार")).toBe("नमस्ते-संसार");
    expect(slugify("你好，世界")).toBe("你好-世界");
    expect(slugify("Γειά σου Κόσμε")).toBe("γειά-σου-κόσμε");
  });

  it("supports single and multi-character URL-safe separators", () => {
    expect(slugify("hello world", "_")).toBe("hello_world");
    expect(slugify("hello world", ".")).toBe("hello.world");
    expect(slugify("hello world", "~")).toBe("hello~world");
    expect(slugify("  hello, world!  ", "--")).toBe("hello--world");
    expect(slugify("hello world", "._~")).toBe("hello._~world");
  });

  it("does not treat regex-sensitive separators as patterns", () => {
    expect(slugify("...hello...world...", ".")).toBe("hello.world");
    expect(slugify("...hello...world...", "..")).toBe("hello..world");
  });

  it("returns an empty slug when no letters or numbers remain", () => {
    expect(slugify("?! / #")).toBe("");
    expect(slugify("\u0301\u0308\uFE0F")).toBe("");
  });

  it("drops orphaned marks without removing marks attached to text", () => {
    expect(slugify("\u0301hello \u0308world")).toBe("hello-world");
    expect(slugify("नमस्ते संसार")).toBe("नमस्ते-संसार");
    expect(slugify("Γειά")).toBe("γειά");
  });

  it.each([
    "",
    "a",
    "1",
    "/",
    "?",
    "#",
    "%",
    "\\",
    " ",
    "\n",
    "💥",
    "。",
    "x)|.*("
  ])("rejects an unsafe separator: %j", (separator) => {
    expect(() => slugify("hello world", separator)).toThrow(TypeError);
  });
});
