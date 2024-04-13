import { describe, expect, it } from "vitest";
import and from ".";

describe("and", () => {
  it("should return true if all arguments are true", () => {
    expect(and(true, true, true)).toBe(true);
    expect(and(true, true, true, true)).toBe(true);
  });

  it("should return false if any argument is false", () => {
    expect(and(true, false, true)).toBe(false);
    expect(and(true, true, false)).toBe(false);
    expect(and(false, false, false)).toBe(false);
  });

  it("should return false if there are no arguments", () => {
    expect(and()).toBe(false);
  });

  //for other than boolean
  it("should return true if all arguments are truthy", () => {
    expect(and(1, 1, "lazykit")).toBe(true);
  });
});
