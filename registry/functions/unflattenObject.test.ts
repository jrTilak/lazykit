import { describe, expect, it } from "bun:test";
import { unflattenObject } from "./unflattenObject";

describe("unflattenObject", () => {
  it("expands dot-delimited keys", () => {
    expect(
      unflattenObject({
        "user.name": "Ada",
        "user.address.city": "London",
        active: true,
      })
    ).toEqual({
      user: { name: "Ada", address: { city: "London" } },
      active: true,
    });
  });

  it("preserves leaf values and their references", () => {
    const nested = {};
    const values: unknown[] = [];
    const date = new Date();
    const result = unflattenObject({ nested, values, date });

    expect(result).toEqual({ nested: {}, values: [], date });
    expect(result.nested).toBe(nested);
    expect(result.values).toBe(values);
    expect(result.date).toBe(date);
  });

  it("supports numeric and inherited-name path segments", () => {
    expect(
      unflattenObject({
        "0.value": "zero",
        "toString.value": 1,
        "hasOwnProperty.value": 2,
      })
    ).toEqual({
      0: { value: "zero" },
      toString: { value: 1 },
      hasOwnProperty: { value: 2 },
    });
  });

  it("accepts null-prototype mappings and empty mappings", () => {
    const input = Object.assign(Object.create(null), {
      "user.name": "Ada",
    }) as Record<string, unknown>;

    expect(unflattenObject(input)).toEqual({ user: { name: "Ada" } });
    expect(unflattenObject({})).toEqual({});
  });

  it("rejects empty and unsafe path segments", () => {
    expect(() => unflattenObject({ "": 1 })).toThrow(TypeError);
    expect(() => unflattenObject({ "a..b": 1 })).toThrow(TypeError);
    expect(() => unflattenObject({ ".a": 1 })).toThrow(TypeError);
    expect(() => unflattenObject({ "a.": 1 })).toThrow(TypeError);
    expect(() => unflattenObject({ "__proto__.value": 1 })).toThrow(TypeError);
    expect(() => unflattenObject({ "a.constructor.value": 1 })).toThrow(TypeError);
    expect(() => unflattenObject({ "prototype.value": 1 })).toThrow(TypeError);
  });

  it("rejects conflicting leaf and branch paths in either order", () => {
    expect(() => unflattenObject({ a: 1, "a.b": 2 })).toThrow(TypeError);
    expect(() => unflattenObject({ "a.b": 2, a: 1 })).toThrow(TypeError);
    expect(() => unflattenObject({ a: undefined, "a.b": 2 })).toThrow(TypeError);
    expect(() => unflattenObject({ a: {}, "a.b": 2 })).toThrow(TypeError);
    expect(() => unflattenObject({ "a.b": 2, "a.b.c": 3 })).toThrow(TypeError);
    expect(() => unflattenObject({ "a.b.c": 3, "a.b": 2 })).toThrow(TypeError);
  });

  it("does not mutate an object supplied as a leaf when paths conflict", () => {
    const leaf = { existing: true };

    expect(() => unflattenObject({ a: leaf, "a.value": 1 })).toThrow(TypeError);
    expect(leaf).toEqual({ existing: true });
  });

  it("rejects non-plain inputs and symbol keys", () => {
    expect(() =>
      unflattenObject([] as unknown as Record<string, unknown>)
    ).toThrow(TypeError);
    expect(() =>
      unflattenObject(new Date() as unknown as Record<string, unknown>)
    ).toThrow(TypeError);
    expect(() => unflattenObject({ [Symbol("value")]: 1 })).toThrow(TypeError);

    const symbol = Symbol("hidden");
    const hiddenSymbol = {};
    Object.defineProperty(hiddenSymbol, symbol, { value: 1 });
    expect(() => unflattenObject(hiddenSymbol)).toThrow(TypeError);
  });

  it("expands declared non-enumerable own string properties", () => {
    const input = {} as {
      "hidden.value": number;
      visible: string;
    };
    Object.defineProperties(input, {
      "hidden.value": { value: 2 },
      visible: { value: "shown", enumerable: true },
    });

    expect(unflattenObject(input)).toEqual({
      hidden: { value: 2 },
      visible: "shown",
    });
  });

  it("uses captured descriptors when an earlier getter deletes a later path", () => {
    const input = {} as {
      "user.first": number;
      "user.second": number;
    };
    Object.defineProperties(input, {
      "user.first": {
        enumerable: true,
        get: () => {
          Reflect.deleteProperty(input, "user.second");
          return 1;
        },
      },
      "user.second": {
        enumerable: true,
        configurable: true,
        get: () => 2,
      },
    });

    const result = unflattenObject(input);

    expect(result).toEqual({ user: { first: 1, second: 2 } });
    expect(Object.hasOwn(input, "user.second")).toBe(false);
  });
});
