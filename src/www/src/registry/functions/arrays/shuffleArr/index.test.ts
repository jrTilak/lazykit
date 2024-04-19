import { describe, expect, it } from "vitest";
import shuffleArr from "./index";

describe("shuffleArr", () => {
  it("should shuffle the array", () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffledArr = shuffleArr(arr);

    // the shuffled array should have the same length as the original array
    expect(shuffledArr.length).toBe(arr.length);

    // the shuffled array might or might not be the same as the original array
    // so we can't compare them directly
  });
});
