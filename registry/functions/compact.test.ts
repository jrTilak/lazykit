import { describe, expect, it } from "bun:test";
import { compact } from "./compact";

describe("compact", () => {
  it("removes every JavaScript falsy value", () => {
    expect(
      compact([0, -0, 0n, false, "", null, undefined, Number.NaN, 1, "ok"])
    ).toEqual([1, "ok"]);
  });

  it("keeps truthy empty containers and bigint values", () => {
    const object = {};
    const array: unknown[] = [];
    expect(compact([object, array, 1n])).toEqual([object, array, 1n]);
  });

  it("preserves order and duplicate truthy values", () => {
    expect(compact([2, null, 1, 2, false, 1])).toEqual([2, 1, 2, 1]);
  });

  it("returns a new array without mutating the input", () => {
    const input = [0, 1, 2];
    const result = compact(input);
    expect(result).toEqual([1, 2]);
    expect(result).not.toBe(input);
    expect(input).toEqual([0, 1, 2]);
  });
});
