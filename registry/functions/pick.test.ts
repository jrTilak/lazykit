import { describe, expect, it } from "bun:test";
import { pick } from "./pick";

describe("pick", () => {
  it("copies only the selected properties", () => {
    expect(pick({ name: "Alice", age: 30, city: "Paris" }, ["name", "age"])).toEqual({
      name: "Alice",
      age: 30,
    });
  });

  it("returns an empty object for an empty key list", () => {
    expect(pick({ a: 1 }, [])).toEqual({});
  });

  it("does not mutate the original object", () => {
    const object = { a: 1, b: 2 };
    pick(object, ["a"]);
    expect(object).toEqual({ a: 1, b: 2 });
  });

  it("accepts duplicate keys", () => {
    expect(pick({ a: 1, b: 2 }, ["a", "a"])).toEqual({ a: 1 });
  });

  it("does not create an absent optional property", () => {
    const input: { value?: number } = {};
    const result = pick(input, ["value"]);

    expect(Object.hasOwn(result, "value")).toBe(false);
  });

  it("preserves a null prototype without synthesizing inherited values", () => {
    const input = Object.create(null) as { toString?: number };
    const result = pick(input, ["toString"]);

    expect(Object.getPrototypeOf(result)).toBeNull();
    expect(result.toString).toBeUndefined();
  });

  it("rejects sparse key lists before returning a misleading shape", () => {
    const keys = new Array<"a">(1);
    expect(() => pick({ a: 1, b: 2 }, keys)).toThrow(
      "keys must not contain empty slots"
    );
  });

  it("supports symbol keys", () => {
    const symbol = Symbol("selected");
    expect(pick({ [symbol]: 1, visible: 2 }, [symbol])).toEqual({
      [symbol]: 1,
    });
  });

  it("copies __proto__ as a data property without changing the prototype", () => {
    const object = JSON.parse('{"__proto__":{"safe":true},"constructor":1}');
    const result = pick(object, ["__proto__", "constructor"]);

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, "__proto__")).toBe(true);
    expect(result.__proto__).toEqual({ safe: true });
    expect(result.constructor).toBe(1);
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

    expect(pick(input, ["first", "second"])).toEqual({
      first: 1,
      second: 2,
    });
  });

  it("rejects arrays and class instances instead of returning misleading types", () => {
    expect(() => {
      // @ts-expect-error array inputs are intentionally unsupported
      pick([1, 2], [0]);
    }).toThrow(TypeError);
    expect(() => pick(new Date(), ["getTime"])).toThrow(TypeError);
  });
});
