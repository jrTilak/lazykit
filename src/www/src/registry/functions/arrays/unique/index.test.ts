import { describe, expect, it } from "vitest";
import unique from ".";

describe("unique", () => {
  it("should return an array with unique elements", () => {
    const arr = [1, 2, 3, 3, 4, 5, 5, 6, 7, 8, 8, 9, 10];
    const result = unique(arr);
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(result).toEqual(expected);
  });
});
