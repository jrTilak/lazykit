import { describe, expect, it, vi } from "bun:test";
import { mapObject } from "./mapObject";

describe("mapObject", () => {
  it("transforms values while preserving keys", () => {
    expect(mapObject({ a: 1, b: 2 }, (value) => value * 2)).toEqual({
      a: 2,
      b: 4,
    });
  });

  it("passes each value, key, and the original object", () => {
    const object = { a: 1 };
    const transform = vi.fn((value: number) => value);
    mapObject(object, transform);
    expect(transform).toHaveBeenCalledWith(1, "a", object);
  });

  it("returns an empty object for empty input", () => {
    expect(mapObject({}, (value) => value)).toEqual({});
  });

  it("does not mutate the input", () => {
    const object = { a: 1 };
    const result = mapObject(object, (value) => value + 1);
    expect(result).toEqual({ a: 2 });
    expect(object).toEqual({ a: 1 });
  });

  it("ignores inherited and non-enumerable properties", () => {
    const object = Object.create({ inherited: 1 }) as Record<string, number>;
    object.visible = 2;
    Object.defineProperty(object, "hidden", { value: 3, enumerable: false });
    expect(mapObject(object, (value) => value * 2)).toEqual({ visible: 4 });
  });

  it("supports enumerable symbol properties", () => {
    const symbol = Symbol("value");
    expect(mapObject({ [symbol]: 2 }, (value) => value * 3)).toEqual({
      [symbol]: 6,
    });
  });

  it("passes numeric keys in their runtime string form", () => {
    const keys: PropertyKey[] = [];
    mapObject({ 1: "one" }, (value, key) => {
      keys.push(key);
      return value;
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

    expect(mapObject(input, (value) => value)).toEqual({
      first: 1,
      second: 2,
    });
  });

  it("maps __proto__ as a data property without changing the prototype", () => {
    const object = JSON.parse('{"__proto__":"value","constructor":"ctor"}');
    const result = mapObject(object, (value) => String(value).toUpperCase());

    expect(Object.getPrototypeOf(result)).toBeNull();
    expect(Object.hasOwn(result, "__proto__")).toBe(true);
    expect(result.__proto__).toBe("VALUE");
    expect(Reflect.get(result, "constructor")).toBe("CTOR");
  });

  it("does not synthesize inherited values in the output", () => {
    const input = { value: 1 } as {
      value: number;
      toString?: number;
    };
    const result = mapObject(input, String);

    expect(Object.getPrototypeOf(result)).toBeNull();
    expect(result.toString).toBeUndefined();
  });

  it("rejects arrays instead of returning an object with an array type", () => {
    expect(() => {
      // @ts-expect-error array inputs are intentionally unsupported
      mapObject([1, 2], (value) => value);
    }).toThrow(TypeError);
  });
});
