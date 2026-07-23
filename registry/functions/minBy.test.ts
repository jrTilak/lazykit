import { describe, expect, it } from "bun:test";
import { minBy } from "./minBy";

describe("minBy", () => {
  it("returns the first minimum", () => {
    const input = [{ n: 2 }, { n: 1 }, { n: 1 }];
    expect(minBy(input, (item) => item.n)).toBe(input[1]);
  });

  it("ignores non-finite values and passes indexes", () => {
    expect(minBy([10, 10], (_, index) => (index === 0 ? NaN : index))).toBe(10);
    expect(minBy([1], () => Infinity)).toBeUndefined();
  });

  it("returns undefined for empty input", () => {
    expect(minBy([], Number)).toBeUndefined();
  });

  it("can retain an undefined array value as the minimum", () => {
    expect(minBy([undefined, "later"], (_, index) => index)).toBeUndefined();
  });

  it("passes the readonly source array to the selector", () => {
    const input = [1, 2];
    const arrays: Array<readonly (number | undefined)[]> = [];
    minBy(input, (_value, _index, array) => {
      arrays.push(array);
      return 0;
    });
    expect(arrays).toEqual([input, input]);
  });

  it("skips empty slots and preserves original indexes", () => {
    const sparse = Array<number>(4);
    sparse[1] = 10;
    sparse[3] = 20;
    const calls: Array<[number, number, boolean]> = [];

    expect(minBy(sparse, (value, index, array) => {
      calls.push([value, index, Object.hasOwn(array, 0)]);
      return value;
    })).toBe(10);
    expect(calls).toEqual([[10, 1, false], [20, 3, false]]);
  });
});
