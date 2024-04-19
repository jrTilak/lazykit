import { describe, expect, it } from "vitest";
import compact from ".";

describe("compact", () => {
  it("should remove falsy values from the array", () => {
    const input = [0, false, "", null, undefined, NaN, {}, []];
    const expected = [{}, []];
    const result = compact(input);
    expect(result).toEqual(expected);
  });
  //strict mode
  it("should remove falsy values from the array with empty array and objects", () => {
    const input = [0, false, "", null, undefined, NaN, {}, []];
    const expected = [] as any;
    const result = compact(input, true);
    expect(result).toEqual(expected);
  });
});
