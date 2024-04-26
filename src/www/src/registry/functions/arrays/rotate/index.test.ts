import { describe, expect, it } from "vitest";
import rotate from ".";

describe("rotate", () => {
  it("should rotate the array to the left by the specified number of positions", () => {
    const arr = [1, 2, 3, 4, 5];
    const rotated = rotate(arr, 2);
    expect(rotated).toEqual([3, 4, 5, 1, 2]);
  });

  it("should rotate the array to the right by the specified number of positions", () => {
    const arr = [1, 2, 3, 4, 5];
    const rotated = rotate(arr, 2, "right");
    expect(rotated).toEqual([4, 5, 1, 2, 3]);
  });

  it("should rotate the array to the left by the specified number of positions (default direction)", () => {
    const arr = [1, 2, 3, 4, 5];
    const rotated = rotate(arr, 3);
    expect(rotated).toEqual([4, 5, 1, 2, 3]);
  });
});
