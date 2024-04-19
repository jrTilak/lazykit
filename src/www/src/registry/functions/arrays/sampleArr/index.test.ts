import { describe, expect, it } from "vitest";
import sampleArr from ".";

describe("sampleArr", () => {
  it("should generate an array of random numbers with the specified size", () => {
    const size = 5;
    const result = sampleArr(size);
    expect(result).toHaveLength(size);
    result.forEach((num) => {
      expect(typeof num).toBe("number");
    });
  });

  it("should throw an error if the size is a negative number", () => {
    const size = -1;
    expect(() => sampleArr(size)).toThrow(Error);
  });
});
