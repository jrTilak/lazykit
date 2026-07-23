import { describe, expect, it, vi } from "bun:test";
import { shuffle } from "./shuffle";

describe("shuffle", () => {
  it("uses Fisher–Yates swaps with the supplied random source", () => {
    expect(shuffle([1, 2, 3, 4], () => 0)).toEqual([2, 3, 4, 1]);
  });

  it("does not mutate the input", () => {
    const input = [1, 2, 3];
    const result = shuffle(input, () => 0.5);
    expect(input).toEqual([1, 2, 3]);
    expect(result).not.toBe(input);
  });

  it("returns new empty and single-value arrays without sampling", () => {
    const random = vi.fn(() => 0.5);
    expect(shuffle([], random)).toEqual([]);
    expect(shuffle([1], random)).toEqual([1]);
    expect(random).not.toHaveBeenCalled();
  });

  it("preserves all values including duplicates", () => {
    expect(shuffle([1, 1, 2], () => 0)).toEqual([1, 2, 1]);
  });

  it("rejects sparse input before sampling", () => {
    const sparse = Array<number>(2);
    sparse[1] = 1;
    const random = vi.fn(() => 0.5);
    expect(() => shuffle(sparse, random)).toThrow(
      "array must not contain empty slots",
    );
    expect(random).not.toHaveBeenCalled();
  });

  it.each([-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid random sample %p",
    (sample) => expect(() => shuffle([1, 2], () => sample)).toThrow(RangeError)
  );
});
