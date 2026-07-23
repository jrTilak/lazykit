import { describe, expect, it } from "bun:test";
import { setPath } from "./setPath";

describe("setPath", () => {
  it("updates nested values without mutating shared input", () => {
    const input = { user: { name: "Ada", settings: { dark: false } }, untouched: {} };
    const result = setPath(input, "user.settings.dark", true);
    expect(result.user.settings.dark).toBe(true);
    expect(input.user.settings.dark).toBe(false);
    expect(result.user).not.toBe(input.user);
    expect(result.untouched).toBe(input.untouched);
  });

  it("creates objects and arrays for missing segments", () => {
    expect(setPath({}, "users.0.name", "Ada")).toEqual({ users: [{ name: "Ada" }] });
  });

  it("supports segment arrays and symbols", () => {
    const symbol = Symbol("value");
    expect(setPath({}, [symbol], 1)[symbol]).toBe(1);
  });

  it("rejects empty paths", () => {
    expect(() => {
      // @ts-expect-error empty literal paths are rejected statically
      setPath({}, "", 1);
    }).toThrow(RangeError);
    expect(() => {
      // @ts-expect-error empty literal tuples are rejected statically
      setPath({}, [], 1);
    }).toThrow(RangeError);
  });

  it("writes special path segments as safe own data properties", () => {
    const result = setPath({}, "__proto__.polluted", true);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, "__proto__")).toBe(true);
    expect(result.__proto__).toEqual({ polluted: true });
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
  });

  it("only creates arrays for valid array indexes", () => {
    expect(setPath({}, ["values", 0], "zero")).toEqual({ values: ["zero"] });

    for (const key of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      const result = setPath({}, ["values", key, "name"], "value");
      const values = Reflect.get(result, "values") as object;
      expect(Array.isArray(values)).toBe(false);
      expect(Reflect.get(values, key)).toEqual({ name: "value" });
    }
  });

  it("matches the maximum JavaScript array index boundary", () => {
    const maximum = setPath({}, ["values", 4_294_967_294], "last");
    expect(Array.isArray(maximum.values)).toBe(true);
    expect(maximum.values.length).toBe(4_294_967_295);
    expect(maximum.values[4_294_967_294]).toBe("last");

    const tooLarge = setPath({}, ["values", 4_294_967_295], "property");
    expect(Array.isArray(tooLarge.values)).toBe(false);
    expect(Reflect.get(tooLarge.values, 4_294_967_295)).toBe("property");
  });

  it("rejects mutations of an array's non-configurable length", () => {
    expect(() => {
      // @ts-expect-error array length mutation paths are rejected statically
      setPath({ values: [1, 2] }, "values.length", 0);
    }).toThrow(TypeError);

    const dynamicPath: string = "values.length";
    expect(() => setPath({ values: [1, 2] }, dynamicPath, 0)).toThrow(
      "path cannot mutate an array's length"
    );
  });

  it("rejects non-plain roots and traversal through non-plain values", () => {
    expect(() => {
      // @ts-expect-error Date is a statically known invalid root
      setPath(new Date(), "value", 1);
    }).toThrow(TypeError);
    expect(() => {
      // @ts-expect-error literal traversal through Date always throws
      setPath({ date: new Date() }, "date.value", 1);
    }).toThrow(TypeError);

    const dynamicPath: string = "date.value";
    expect(() => setPath({ date: new Date() }, dynamicPath, 1)).toThrow(
      TypeError
    );
    expect(() =>
      setPath({ callback: () => 1 }, dynamicPath.replace("date", "callback"), 1)
    ).toThrow(TypeError);
  });

  it("allows a final segment to replace an atomic value", () => {
    expect(setPath({ date: new Date(0) }, "date", "replaced")).toEqual({
      date: "replaced",
    });
  });

  it("preserves untouched non-enumerable, symbol, and special descriptors", () => {
    const symbol = Symbol("metadata");
    const input = {
      hidden: 1,
      nested: { value: 1 },
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

    const result = setPath(input, "nested.value", 2);

    expect(Object.getOwnPropertyDescriptor(result, "hidden")).toEqual(
      Object.getOwnPropertyDescriptor(input, "hidden")
    );
    expect(Object.getOwnPropertyDescriptor(result, "__proto__")).toEqual(
      Object.getOwnPropertyDescriptor(input, "__proto__")
    );
    expect(result[symbol]).toBe("symbol");
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });

  it("replaces stale property types in its inferred result", () => {
    const result = setPath({ count: 1 }, "count", "one");
    const count: string = result.count;
    void count;

    // @ts-expect-error the number was replaced with a string
    const staleCount: number = result.count;
    void staleCount;
  });
});
