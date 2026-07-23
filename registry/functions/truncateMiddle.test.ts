import { describe, expect, it } from "bun:test";
import { truncateMiddle } from "./truncateMiddle";

describe("truncateMiddle", () => {
  it("preserves both ends within the maximum length", () => {
    expect(truncateMiddle("abcdefghij", 7)).toBe("abc…hij");
  });

  it("gives an odd extra character to the start", () => {
    expect(truncateMiddle("abcdefghij", 6, "-")).toBe("abc-ij");
  });

  it("handles Unicode, short strings, and oversized markers", () => {
    expect(truncateMiddle("😀😀😀", 2)).toBe("😀…");
    expect(truncateMiddle("short", 5)).toBe("short");
    expect(truncateMiddle("abcdef", 2, "...")).toBe("..");
    expect(() => truncateMiddle("value", 1.5)).toThrow(RangeError);
  });
});
