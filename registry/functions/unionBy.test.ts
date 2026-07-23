import { describe, expect, it } from "bun:test";
import { unionBy } from "./unionBy";

describe("unionBy", () => {
  it("combines arrays and keeps the earliest value for each key", () => {
    const first = { id: 1, source: "first" };
    expect(
      unionBy(
        [
          [first],
          [
            { id: 1, source: "second" },
            { id: 2, source: "second" },
          ],
        ],
        (item) => item.id,
      ),
    ).toEqual([first, { id: 2, source: "second" }]);
  });

  it("supports empty input and object keys", () => {
    const key = {};
    expect(unionBy([], String)).toEqual([]);
    expect(unionBy([[{ key }, { key }]], (item) => item.key)).toHaveLength(1);
  });

  it("passes indexes relative to each current array", () => {
    const first = [{ id: 1 }, { id: 2 }];
    const second = [{ id: 2 }, { id: 3 }];
    const calls: Array<
      [number, number, readonly ({ id: number } | undefined)[]]
    > = [];

    expect(
      unionBy([first, second], (value, index, array) => {
        calls.push([value.id, index, array]);
        return value.id;
      }),
    ).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(calls).toEqual([
      [1, 0, first],
      [2, 1, first],
      [2, 0, second],
      [3, 1, second],
    ]);
  });

  it("skips empty slots in both the outer and inner arrays", () => {
    const first = Array<number>(3);
    first[1] = 1;
    const arrays = Array<readonly number[]>(3);
    arrays[1] = first;
    arrays[2] = [2];
    const calls: Array<[number, number, boolean]> = [];

    expect(unionBy(arrays, (value, index, array) => {
      calls.push([value, index, Object.hasOwn(array, 0)]);
      return value;
    })).toEqual([1, 2]);
    expect(calls).toEqual([[1, 1, false], [2, 0, true]]);
  });
});
