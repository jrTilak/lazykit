import { describe, expect, it } from "bun:test";
import { unsetPath } from "./unsetPath";

describe("unsetPath", () => {
  it("removes nested values without mutating input", () => {
    const input = { user: { name: "Ada", age: 37 }, untouched: {} };
    const result = unsetPath(input, "user.age");
    expect(result).toEqual({ user: { name: "Ada" }, untouched: {} });
    expect(input.user.age).toBe(37);
    expect(result.untouched).toBe(input.untouched);
  });

  it("removes array entries without leaving holes", () => {
    expect(unsetPath({ values: [1, 2, 3] }, "values.1")).toEqual({ values: [1, 3] });
  });

  it("returns the original object when the path is missing", () => {
    const input = { value: 1 };
    expect(unsetPath(input, "missing.value")).toBe(input);
  });

  it("rejects empty paths", () => {
    expect(() => {
      // @ts-expect-error empty literal paths are rejected statically
      unsetPath({}, "");
    }).toThrow(RangeError);
    expect(() => {
      // @ts-expect-error empty literal tuples are rejected statically
      unsetPath({}, []);
    }).toThrow(RangeError);
  });

  it("removes special own data properties without prototype mutation", () => {
    const input = JSON.parse('{"__proto__":{"secret":true},"keep":1}');
    const result = unsetPath(input, "__proto__.secret");
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, "__proto__")).toBe(true);
    expect(result.__proto__).toEqual({});
    expect(({} as { secret?: boolean }).secret).toBeUndefined();
  });

  it("treats invalid numeric array keys as properties, not indexes", () => {
    const values = [1, 2] as number[] & Record<string, unknown>;
    Object.defineProperty(values, "-1", {
      value: "metadata",
      enumerable: true,
      configurable: true,
      writable: true,
    });
    const result = unsetPath(values, [-1]);
    expect(Array.from(result)).toEqual([1, 2]);
    expect(Object.hasOwn(result, "-1")).toBe(false);
  });

  it("matches the maximum JavaScript array index boundary", () => {
    const maximum: string[] = [];
    maximum[4_294_967_294] = "last";
    const withoutMaximum = unsetPath(maximum, [4_294_967_294]);
    expect(withoutMaximum.length).toBe(4_294_967_294);
    expect(Object.hasOwn(withoutMaximum, 4_294_967_294)).toBe(false);

    const tooLarge: string[] = [];
    Object.defineProperty(tooLarge, "4294967295", {
      value: "property",
      enumerable: true,
      configurable: true,
      writable: true,
    });
    const withoutProperty = unsetPath(tooLarge, [4_294_967_295]);
    expect(withoutProperty.length).toBe(0);
    expect(Object.hasOwn(withoutProperty, 4_294_967_295)).toBe(false);
  });

  it("rejects removal of an array's non-configurable length", () => {
    expect(() => {
      // @ts-expect-error array length mutation paths are rejected statically
      unsetPath({ values: [1, 2] }, "values.length");
    }).toThrow(TypeError);
  });

  it("rejects non-plain roots and traversal through non-plain values", () => {
    expect(() => {
      // @ts-expect-error Date is a statically known invalid root
      unsetPath(new Date(), "value");
    }).toThrow(TypeError);
    const date = new Date() as Date & { value?: number };
    date.value = 1;
    expect(() => {
      // @ts-expect-error literal traversal through Date always throws
      unsetPath({ date }, "date.value");
    }).toThrow(TypeError);

    const dynamicPath: string = "date.value";
    expect(() => unsetPath({ date }, dynamicPath)).toThrow(TypeError);
  });

  it("allows a final segment to remove an atomic value", () => {
    expect(unsetPath({ date: new Date(0), keep: true }, "date")).toEqual({
      keep: true,
    });
  });

  it("preserves untouched non-enumerable, symbol, and special descriptors", () => {
    const symbol = Symbol("metadata");
    const input = {
      hidden: 1,
      nested: { remove: true, keep: true },
      [symbol]: "symbol",
    };
    Object.defineProperty(input, "hidden", {
      value: 1,
      enumerable: false,
      configurable: false,
      writable: false,
    });
    Object.defineProperty(input, "__proto__", {
      value: "special",
      enumerable: false,
      configurable: false,
      writable: false,
    });

    const result = unsetPath(input, "nested.remove");

    expect(Object.getOwnPropertyDescriptor(result, "hidden")).toEqual(
      Object.getOwnPropertyDescriptor(input, "hidden")
    );
    expect(Object.getOwnPropertyDescriptor(result, "__proto__")).toEqual(
      Object.getOwnPropertyDescriptor(input, "__proto__")
    );
    expect(result[symbol]).toBe("symbol");
  });

  it("removes deleted keys from its inferred result", () => {
    const result = unsetPath({ user: { name: "Ada", token: "secret" } }, "user.token");
    const name: string = result.user.name;
    void name;

    // @ts-expect-error token was removed from the nested result
    result.user.token;

    const optionalInput: { user?: { token: string } } = {};
    const optionalResult = unsetPath(optionalInput, "user.token");
    const optionalUser: {} | undefined = optionalResult.user;
    void optionalUser;
  });
});
