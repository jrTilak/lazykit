import { describe, expect, it } from "bun:test";
import { keyBy } from "./keyBy";

describe("keyBy", () => {
  it("indexes values and lets later keys win", () => {
    const result = keyBy([{ id: "a", n: 1 }, { id: "a", n: 2 }], (item) => item.id);
    expect(result.a).toEqual({ id: "a", n: 2 });
  });

  it("supports symbols and dangerous-looking string keys", () => {
    const symbol = Symbol("item");
    const result = keyBy(
      ["symbol", "proto"],
      (value) => value === "symbol" ? symbol : "__proto__"
    );
    expect(result[symbol]).toBe("symbol");
    expect(result.__proto__).toBe("proto");
    expect(Object.getPrototypeOf(result)).toBeNull();
  });

  it("passes indexes and skips sparse slots", () => {
    const input = new Array<string>(3);
    input[1] = "present";
    const indexes: number[] = [];
    const result = keyBy(input, (value, index) => {
      indexes.push(index);
      return value;
    });
    expect(indexes).toEqual([1]);
    expect(result.present).toBe("present");
  });

  it("returns an empty null-prototype object", () => {
    expect(Object.keys(keyBy([], String))).toEqual([]);
  });
});
