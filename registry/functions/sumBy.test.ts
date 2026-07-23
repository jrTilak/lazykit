import { describe, expect, it } from "bun:test";
import { sumBy } from "./sumBy";

describe("sumBy", () => {
  it("sums selector results and passes indexes", () => {
    expect(sumBy([10, 20, 30], (value, index) => value + index)).toBe(63);
  });

  it("returns zero for empty input", () => {
    expect(sumBy([], Number)).toBe(0);
  });

  it("rejects non-finite selector results", () => {
    expect(() => sumBy([1], () => NaN)).toThrow(RangeError);
    expect(() => sumBy([1], () => Infinity)).toThrow(RangeError);
  });

  it("rejects a total that overflows to a non-finite number", () => {
    expect(() =>
      sumBy([Number.MAX_VALUE, Number.MAX_VALUE], (value) => value),
    ).toThrow("sum must remain finite");
  });

  it("passes the readonly source array to the selector", () => {
    const input = [1, 2];
    const arrays: Array<readonly (number | undefined)[]> = [];
    expect(
      sumBy(input, (value, _index, array) => {
        arrays.push(array);
        return value;
      }),
    ).toBe(3);
    expect(arrays).toEqual([input, input]);
  });

  it("skips empty slots and preserves original indexes", () => {
    const sparse = Array<number>(4);
    sparse[1] = 10;
    sparse[3] = 20;
    const calls: Array<[number, number, boolean]> = [];

    expect(sumBy(sparse, (value, index, array) => {
      calls.push([value, index, Object.hasOwn(array, 0)]);
      return value;
    })).toBe(30);
    expect(calls).toEqual([[10, 1, false], [20, 3, false]]);
  });
});
