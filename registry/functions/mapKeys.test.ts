import { describe, expect, it } from "bun:test";
import { mapKeys } from "./mapKeys";

describe("mapKeys", () => {
  it("maps string and symbol keys and passes callback context", () => {
    const symbol = Symbol("mapped");
    const input = { first: 1, second: 2 };
    const calls: unknown[][] = [];
    const result = mapKeys(input, (value, key, object) => {
      calls.push([value, key, object]);
      return key === "first" ? symbol : key.toUpperCase();
    });
    expect(result[symbol]).toBe(1);
    expect(result.SECOND).toBe(2);
    expect(calls[0]).toEqual([1, "first", input]);
  });

  it("lets later collisions win safely", () => {
    const result = mapKeys({ a: 1, b: 2 }, () => "__proto__");
    expect(result.__proto__).toBe(2);
    expect(Object.getPrototypeOf(result)).toBeNull();
  });

  it("reports numeric source keys as their runtime strings", () => {
    const keys: PropertyKey[] = [];
    const result = mapKeys({ 1: "one", 2: "two" }, (value, key) => {
      keys.push(key);
      return `${key}:${value}`;
    });
    expect(keys).toEqual(["1", "2"]);
    expect(result["1:one"]).toBe("one");
    expect(result["2:two"]).toBe("two");
  });

  it("ignores inherited and non-enumerable properties", () => {
    const input = Object.assign(Object.create({ inherited: 1 }), { visible: 2 });
    Object.defineProperty(input, "hidden", { value: 3, enumerable: false });
    const seen: PropertyKey[] = [];
    const result = mapKeys(
      input as { visible: number; hidden: number; inherited: number },
      (_value, key) => {
        seen.push(key);
        return key;
      }
    );
    expect(seen).toEqual(["visible"]);
    expect(result).toEqual({ visible: 2 });
  });

  it("snapshots later data properties before an earlier getter deletes them", () => {
    const input = {} as { first: number; second: number };
    Object.defineProperties(input, {
      first: {
        enumerable: true,
        get: () => {
          Reflect.deleteProperty(input, "second");
          return 1;
        },
      },
      second: { value: 2, enumerable: true, configurable: true },
    });

    expect(mapKeys(input, (_value, key) => key)).toEqual({
      first: 1,
      second: 2,
    });
  });
});
