import { describe, expect, it } from "bun:test";
import { uniqueBy } from "./uniqueBy";

describe("uniqueBy", () => {
  it("keeps the first value for each key", () => {
    const input = [
      { id: 1, name: "first" },
      { id: 1, name: "second" },
      { id: 2, name: "third" },
    ];
    expect(uniqueBy(input, (item) => item.id)).toEqual([input[0], input[2]]);
  });

  it("passes the index and supports object identity keys", () => {
    const key = {};
    expect(
      uniqueBy([key, key], (value, index) => (index === 0 ? value : key)),
    ).toEqual([key]);
  });

  it("handles empty input", () => {
    expect(uniqueBy([], String)).toEqual([]);
  });

  it("passes the source array to the selector", () => {
    const input = [{ id: 1 }, { id: 2 }];
    const arrays: Array<readonly ({ id: number } | undefined)[]> = [];
    uniqueBy(input, (value, _index, array) => {
      arrays.push(array);
      return value.id;
    });
    expect(arrays).toEqual([input, input]);
  });

  it("skips empty slots and preserves original indexes", () => {
    const sparse = Array<number>(4);
    sparse[1] = 1;
    sparse[3] = 1;
    const calls: Array<[number, number, boolean]> = [];

    expect(uniqueBy(sparse, (value, index, array) => {
      calls.push([value, index, Object.hasOwn(array, 0)]);
      return value;
    })).toEqual([1]);
    expect(calls).toEqual([[1, 1, false], [1, 3, false]]);
  });
});
