import chunk from ".";
import { expect, test } from "vitest";

const SAMPLE_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

test("chunk", () => {
  // default size
  expect(chunk(SAMPLE_ARRAY)).toEqual([
    [1],
    [2],
    [3],
    [4],
    [5],
    [6],
    [7],
    [8],
    [9],
    [10],
  ]);

  // custom size
  expect(chunk(SAMPLE_ARRAY, 3)).toEqual([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10],
  ]);

  // strict mode
  expect(chunk(SAMPLE_ARRAY, 3, true)).toEqual([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
});
