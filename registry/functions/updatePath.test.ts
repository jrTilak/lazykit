import { describe, expect, it } from "bun:test";
import { updatePath } from "./updatePath";

describe("updatePath", () => {
  it("updates existing values immutably", () => {
    const input = { cart: { count: 2 }, stable: {} };
    const result = updatePath(input, "cart.count", (value) => value + 1);
    expect(result.cart.count).toBe(3);
    expect(input.cart.count).toBe(2);
    expect(result.stable).toBe(input.stable);
  });

  it("creates missing containers and passes undefined", () => {
    expect(updatePath({}, "items.0", (value) => value ?? "first")).toEqual({ items: ["first"] });
  });

  it("invokes the updater once", () => {
    let calls = 0;
    updatePath({}, "value", () => ++calls);
    expect(calls).toBe(1);
  });

  it("rejects empty paths", () => {
    expect(() => {
      // @ts-expect-error empty literal paths are rejected statically
      updatePath({}, "", () => 1);
    }).toThrow(RangeError);
    expect(() => {
      // @ts-expect-error empty literal tuples are rejected statically
      updatePath({}, [], () => 1);
    }).toThrow(RangeError);
  });

  it("updates special path segments without prototype mutation", () => {
    const result = updatePath({}, "constructor.prototype.safe", () => true);
    expect(Object.hasOwn(result, "constructor")).toBe(true);
    expect(result.constructor).toEqual({ prototype: { safe: true } });
    expect(({} as { safe?: boolean }).safe).toBeUndefined();
  });

  it("only creates arrays for valid array indexes", () => {
    expect(updatePath({}, ["values", 0], () => "zero")).toEqual({
      values: ["zero"],
    });

    for (const key of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      const result = updatePath({}, ["values", key, "name"], () => "value");
      const values = Reflect.get(result, "values") as object;
      expect(Array.isArray(values)).toBe(false);
      expect(Reflect.get(values, key)).toEqual({ name: "value" });
    }
  });

  it("matches the maximum JavaScript array index boundary", () => {
    const maximum = updatePath(
      {},
      ["values", 4_294_967_294],
      () => "last"
    );
    expect(Array.isArray(maximum.values)).toBe(true);
    expect(maximum.values.length).toBe(4_294_967_295);
    expect(maximum.values[4_294_967_294]).toBe("last");

    const tooLarge = updatePath(
      {},
      ["values", 4_294_967_295],
      () => "property"
    );
    expect(Array.isArray(tooLarge.values)).toBe(false);
    expect(Reflect.get(tooLarge.values, 4_294_967_295)).toBe("property");
  });

  it("rejects mutations of an array's non-configurable length", () => {
    let calls = 0;
    expect(() => {
      // @ts-expect-error array length mutation paths are rejected statically
      updatePath({ values: [1, 2] }, "values.length", () => ++calls);
    }).toThrow(TypeError);
    expect(calls).toBe(0);
  });

  it("rejects non-plain roots and traversal through non-plain values", () => {
    expect(() => {
      // @ts-expect-error Date is a statically known invalid root
      updatePath(new Date(), "value", () => 1);
    }).toThrow(TypeError);
    expect(() => {
      // @ts-expect-error literal traversal through Date always throws
      updatePath({ date: new Date() }, "date.value", () => 1);
    }).toThrow(TypeError);

    const dynamicPath: string = "date.value";
    expect(() =>
      updatePath({ date: new Date() }, dynamicPath, () => 1)
    ).toThrow(TypeError);
  });

  it("allows a final segment to replace an atomic value", () => {
    expect(
      updatePath({ date: new Date(0) }, "date", () => "replaced")
    ).toEqual({ date: "replaced" });
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

    const result = updatePath(input, "nested.value", (value) => value + 1);

    expect(Object.getOwnPropertyDescriptor(result, "hidden")).toEqual(
      Object.getOwnPropertyDescriptor(input, "hidden")
    );
    expect(Object.getOwnPropertyDescriptor(result, "__proto__")).toEqual(
      Object.getOwnPropertyDescriptor(input, "__proto__")
    );
    expect(result[symbol]).toBe("symbol");
  });

  it("types both the current value and the updated result", () => {
    const result = updatePath({ count: 1 }, "count", (current) => {
      const count: number = current;
      return String(count);
    });
    const count: string = result.count;
    void count;

    const created = updatePath({}, "user.name", (current) => {
      const missing: undefined = current;
      return missing ?? "Ada";
    });
    const name: string = created.user.name;
    void name;
  });
});
