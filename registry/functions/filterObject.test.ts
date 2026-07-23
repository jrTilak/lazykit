import { describe, expect, it, vi } from "bun:test";
import { filterObject } from "./filterObject";

describe("filterObject", () => {
  it("keeps properties whose predicate returns true", () => {
    expect(filterObject({ a: 1, b: 2, c: 3 }, (value) => value > 1)).toEqual({
      b: 2,
      c: 3,
    });
  });

  it("passes each value, key, and the original object", () => {
    const object = { a: 1 };
    const predicate = vi.fn(() => true);
    filterObject(object, predicate);
    expect(predicate).toHaveBeenCalledWith(1, "a", object);
  });

  it("handles empty objects and no matches", () => {
    expect(filterObject({}, () => true)).toEqual({});
    expect(filterObject({ a: 1 }, () => false)).toEqual({});
  });

  it("does not mutate the input", () => {
    const object = { a: 1, b: 2 };
    const result = filterObject(object, () => true);
    expect(result).toEqual(object);
    expect(result).not.toBe(object);
    expect(object).toEqual({ a: 1, b: 2 });
  });

  it("ignores inherited and non-enumerable properties", () => {
    const object = Object.create({ inherited: 1 }) as Record<string, number>;
    object.visible = 2;
    Object.defineProperty(object, "hidden", { value: 3, enumerable: false });
    expect(filterObject(object, () => true)).toEqual({ visible: 2 });
  });

  it("supports enumerable symbol properties", () => {
    const symbol = Symbol("value");
    const object = { [symbol]: 1, visible: 2 };
    expect(filterObject(object, (_, key) => key === symbol)).toEqual({
      [symbol]: 1,
    });
  });

  it("passes numeric keys in their runtime string form", () => {
    const keys: PropertyKey[] = [];
    filterObject({ 1: "one" }, (_value, key) => {
      keys.push(key);
      return true;
    });
    expect(keys).toEqual(["1"]);
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

    expect(filterObject(input, () => true)).toEqual({ first: 1, second: 2 });
  });

  it("copies __proto__ as a data property without changing the prototype", () => {
    const object = JSON.parse('{"__proto__":{"safe":true},"constructor":1}');
    const result = filterObject(object, () => true);

    expect(Object.getPrototypeOf(result)).toBeNull();
    expect(Object.hasOwn(result, "__proto__")).toBe(true);
    expect(result.__proto__).toEqual({ safe: true });
    expect(Reflect.get(result, "constructor")).toBe(1);
    expect(({} as { safe?: boolean }).safe).toBeUndefined();
  });

  it("does not synthesize inherited values in the output", () => {
    const input = { value: 1 } as {
      value: number;
      toString?: number;
    };
    const result = filterObject(input, () => true);

    expect(Object.getPrototypeOf(result)).toBeNull();
    expect(result.toString).toBeUndefined();
  });

  it("rejects arrays instead of returning an object with an array type", () => {
    expect(() => {
      // @ts-expect-error array inputs are intentionally unsupported
      filterObject([1, 2], () => true);
    }).toThrow(TypeError);
  });
});
