import { describe, expect, it } from "vitest";
import nor from ".";

describe("nor", () => {
  it("should return false if at least one argument is truthy", () => {
    expect(nor(true, false)).toBe(false);
    expect(nor(false, true)).toBe(false);
    expect(nor(true, true)).toBe(false);
  });

  it("should return true if all arguments are falsy", () => {
    expect(nor(false, false)).toBe(true);
  });

  it("should return false if no arguments are provided", () => {
    expect(nor()).toBe(false);
  });

  //other than boolean
  it("should return false if at least one argument is truthy", () => {
    expect(nor(1, 0)).toBe(false);
    expect(nor(0, 1)).toBe(false);
    expect(nor(1, 1)).toBe(false);
  });

  it("should return true if all arguments are falsy", () => {
    expect(nor(0, 0)).toBe(true);
  });

  //other than boolean and number
  it("should return false if at least one argument is truthy", () => {
    expect(nor("abcd", {})).toBe(false);
    expect(nor({}, "abcd")).toBe(false);
    expect(nor("abcd", "abcd")).toBe(false);
  });
});
