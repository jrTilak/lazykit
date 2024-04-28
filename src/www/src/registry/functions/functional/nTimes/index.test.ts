import { describe, expect, it } from "vitest";
import nTimes from ".";

describe("nTimes", () => {
  it("should call the provided function n times and return an array of the results", () => {
    const fn = () => "result";
    const result = nTimes(fn, 3);
    expect(result).toEqual(["result", "result", "result"]);
  });

  it("should call the provided function once and return an array with a single result by default", () => {
    const fn = () => "result";
    const result = nTimes(fn);
    expect(result).toEqual(["result"]);
  });

  it("should throw an error if n is less than 0", () => {
    const fn = () => "result";
    expect(() => nTimes(fn, -1)).toThrow("n must be greater than 0");
  });

  it("should call the provided function n times and return an array of the results", () => {
    const result = nTimes(() => "result", 3);
    expect(result).toEqual(["result", "result", "result"]);
  });

  it("should also give the index of the iteration", () => {
    const result = nTimes((i) => i, 3);
    expect(result).toEqual([0, 1, 2]);
  });
});
