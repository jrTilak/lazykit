import { describe, expect, it } from "bun:test";
import { chunk } from "./chunk";

describe("chunk", () => {
  it("keeps an incomplete final chunk by default", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("leaves complete chunks unchanged", () => {
    expect(chunk([1, 2, 3, 4], 2, { remainder: "discard" })).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("discards an incomplete final chunk", () => {
    expect(chunk([1, 2, 3, 4, 5], 2, { remainder: "discard" })).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("wraps from the start until the final chunk is full", () => {
    expect(chunk([1, 2], 5, { remainder: "wrap" })).toEqual([
      [1, 2, 1, 2, 1],
    ]);
  });

  it("returns an empty array for empty input in every mode", () => {
    expect(chunk([], 2)).toEqual([]);
    expect(chunk([], 2, { remainder: "discard" })).toEqual([]);
    expect(chunk([], 2, { remainder: "wrap" })).toEqual([]);
  });

  it("does not mutate the input", () => {
    const input = [1, 2, 3];
    chunk(input, 2, { remainder: "wrap" });
    expect(input).toEqual([1, 2, 3]);
  });

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid size %p",
    (size) => expect(() => chunk([1, 2], size)).toThrow(RangeError)
  );

  it("rejects unsafe integer sizes", () => {
    expect(() => chunk([1], Number.MAX_SAFE_INTEGER + 1)).toThrow(
      "size must be a positive safe integer"
    );
  });
});
