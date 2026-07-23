import { describe, expect, it } from "bun:test";
import { flattenObject } from "./flattenObject";

describe("flattenObject", () => {
  it("flattens nested plain objects while leaving arrays and dates intact", () => {
    const date = new Date();
    const instance = new (class Box {
      value = 1;
    })();

    const result = flattenObject({
      user: { name: "Ada", address: { city: "London" } },
      values: [1],
      date,
      instance,
    });

    expect(result).toEqual({
      "user.name": "Ada",
      "user.address.city": "London",
      values: [1],
      date,
      instance,
    });
    expect(result.instance).toBe(instance);
  });

  it("preserves empty nested objects", () => {
    expect(flattenObject({ nested: {} })).toEqual({ nested: {} });
    expect(flattenObject({})).toEqual({});
  });

  it("supports null-prototype objects, numeric keys, and repeated references", () => {
    const shared = { value: 1 };
    const input = Object.assign(Object.create(null), {
      1: "one",
      first: shared,
      second: shared,
    }) as Record<string, unknown>;

    expect(flattenObject(input)).toEqual({
      "1": "one",
      "first.value": 1,
      "second.value": 1,
    });
  });

  it("returns a null-prototype result", () => {
    expect(Object.getPrototypeOf(flattenObject({ value: 1 }))).toBeNull();
  });

  it("rejects ambiguous, unsafe, and circular objects at any depth", () => {
    expect(() => flattenObject({ "a.b": 1 })).toThrow(TypeError);
    expect(() => flattenObject(JSON.parse('{"__proto__":1}'))).toThrow(TypeError);
    expect(() => flattenObject({ nested: { constructor: 1 } })).toThrow(TypeError);

    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(() => flattenObject(circular)).toThrow(TypeError);

    const indirect: Record<string, unknown> = {};
    indirect.child = { parent: indirect };
    expect(() => flattenObject(indirect)).toThrow(TypeError);
  });

  it("rejects non-plain roots and symbol keys", () => {
    expect(() =>
      flattenObject([] as unknown as Record<string, unknown>)
    ).toThrow(TypeError);
    expect(() =>
      flattenObject(new Date() as unknown as Record<string, unknown>)
    ).toThrow(TypeError);

    const symbol = Symbol("value");
    const root = { [symbol]: 1 };
    expect(() => flattenObject(root)).toThrow(TypeError);
    expect(() => flattenObject({ nested: { [symbol]: 1 } })).toThrow(TypeError);

    const hiddenSymbol = {};
    Object.defineProperty(hiddenSymbol, symbol, { value: 1 });
    expect(() => flattenObject(hiddenSymbol)).toThrow(TypeError);
  });

  it("flattens declared non-enumerable own string properties", () => {
    const input = {} as {
      hidden: { value: number };
      visible: string;
    };
    Object.defineProperties(input, {
      hidden: { value: { value: 2 } },
      visible: { value: "shown", enumerable: true },
    });

    expect(flattenObject(input)).toEqual({
      "hidden.value": 2,
      visible: "shown",
    });
  });

  it("uses captured descriptors when an earlier getter deletes a later key", () => {
    const input = {} as {
      first: number;
      second: number;
    };
    Object.defineProperties(input, {
      first: {
        enumerable: true,
        get: () => {
          Reflect.deleteProperty(input, "second");
          return 1;
        },
      },
      second: {
        enumerable: true,
        configurable: true,
        get: () => 2,
      },
    });

    const result = flattenObject(input);

    expect(result).toEqual({ first: 1, second: 2 });
    expect(Object.hasOwn(input, "second")).toBe(false);
  });
});
