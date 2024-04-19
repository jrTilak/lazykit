import { describe, expect, it } from "vitest";
import nand from ".";

describe("nand", () => {
  it("should return false if all arguments are true", () => {
    expect(nand(true, true, true)).toBe(false);
    expect(nand(true, true, true, true)).toBe(false);
  });

  it("should return true if any argument is false", () => {
    expect(nand(true, false, true)).toBe(true);
    expect(nand(true, true, false)).toBe(true);
    expect(nand(false, false, false)).toBe(true);
  });

  it("should return false if there are no arguments", () => {
    expect(nand()).toBe(false);
  });

  //for other than boolean
  it("should return true if all arguments are truthy", () => {
    expect(nand(1, 1, "lazykit")).toBe(false);
  });
});
