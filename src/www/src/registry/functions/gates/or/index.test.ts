import { describe, expect, it } from "vitest";
import or from ".";

describe("or", () => {
  it("should return true if at least one argument is truthy", () => {
    expect(or(true, false)).toBe(true);
    expect(or(false, true)).toBe(true);
    expect(or(true, true)).toBe(true);
  });

  it("should return false if all arguments are falsy", () => {
    expect(or(false, false)).toBe(false);
  });

  it("should return false if no arguments are provided", () => {
    expect(or()).toBe(false);
  });

  //other than boolean
  it("should return true if at least one argument is truthy", () => {
    expect(or(1, 0)).toBe(true);
    expect(or(0, 1)).toBe(true);
    expect(or(1, 1)).toBe(true);
  });

  it("should return false if all arguments are falsy", () => {
    expect(or(0, 0)).toBe(false);
  });

  it("should return false if no arguments are provided", () => {
    expect(or()).toBe(false);
  });

  //other than boolean and number
  it("should return true if at least one argument is truthy", () => {
    expect(or("abcd", {})).toBe(true);
    expect(or({}, "abcd")).toBe(true);
    expect(or("abcd", "abcd")).toBe(true);
  });
});
