import { describe, expect, it } from "bun:test";
import { truncate } from "./truncate";

describe("truncate", () => {
  it("includes the omission marker in the maximum length", () => {
    expect(truncate("Hello world", 8)).toBe("Hello w…");
    expect(Array.from(truncate("Hello world", 8))).toHaveLength(8);
  });

  it("supports custom and oversized omission markers", () => {
    expect(truncate("abcdef", 5, "...")).toBe("ab...");
    expect(truncate("abcdef", 2, "...")).toBe("..");
  });

  it("counts Unicode code points and validates length", () => {
    expect(truncate("😀😀😀", 2)).toBe("😀…");
    expect(truncate("short", 5)).toBe("short");
    expect(() => truncate("value", -1)).toThrow(RangeError);
  });
});
