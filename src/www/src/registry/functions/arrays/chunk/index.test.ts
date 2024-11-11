import chunk from ".";
import { describe, expect, it } from "vitest";

const SAMPLE_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe("chunk", () => {
  // default
  it("should chunk in size of 3", () => {
    expect(chunk(SAMPLE_ARRAY, 3)).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10],
    ]);
  });

  // remove
  it("should chunk in size of 3 and remove last part that does not match the given size", () => {
    expect(chunk(SAMPLE_ARRAY, 3, { style: "remove" })).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
  });
  it("should chunk in size of 3 repeat the initial elements to match the size", () => {
    expect(chunk(SAMPLE_ARRAY, 3, { style: "repeat" })).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10, 1, 2],
    ]);
  });
});
