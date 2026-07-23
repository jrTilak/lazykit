import { describe, expect, it } from "bun:test";
import { moveItem } from "./moveItem";

describe("moveItem", () => {
  it("moves values forward and backward", () => {
    expect(moveItem(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"]);
    expect(moveItem(["a", "b", "c"], 2, 0)).toEqual(["c", "a", "b"]);
  });

  it("supports negative indexes and returns a copy for the same index", () => {
    expect(moveItem([1, 2, 3], -1, 0)).toEqual([3, 1, 2]);
    const input = [1];
    expect(moveItem(input, 0, 0)).not.toBe(input);
  });

  it("rejects invalid or missing indexes", () => {
    expect(() => moveItem([], 0, 0)).toThrow(RangeError);
    expect(() => moveItem([1], 0, 1)).toThrow(RangeError);
    expect(() => moveItem([1], 0.5, 0)).toThrow(RangeError);
  });
});
