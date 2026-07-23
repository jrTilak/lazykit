import { describe, expect, it } from "bun:test";
import { renameKeys } from "./renameKeys";

describe("renameKeys", () => {
  it("renames multiple own properties", () => {
    expect(
      renameKeys({ first: "Ada", last: "Lovelace", age: 36 }, [
        { from: "first", to: "firstName" },
        { from: "last", to: "lastName" },
      ])
    ).toEqual({ firstName: "Ada", lastName: "Lovelace", age: 36 });
  });

  it("does not mutate the original object", () => {
    const object = { a: 1, b: 2 };
    renameKeys(object, [{ from: "a", to: "x" }]);
    expect(object).toEqual({ a: 1, b: 2 });
  });

  it("applies mappings simultaneously instead of chaining values", () => {
    expect(
      renameKeys({ a: 1, b: 2 }, [
        { from: "a", to: "b" },
        { from: "b", to: "c" },
      ])
    ).toEqual({ b: 1, c: 2 });
  });

  it("uses the last mapping when targets collide", () => {
    expect(
      renameKeys({ a: 1, b: 2 }, [
        { from: "a", to: "value" },
        { from: "b", to: "value" },
      ])
    ).toEqual({ value: 2 });
  });

  it("rejects sparse mapping lists before returning a misleading shape", () => {
    const mappings = new Array<{ from: "a"; to: "renamed" }>(1);
    expect(() => renameKeys({ a: 1 }, mappings)).toThrow(
      "mappings must not contain empty slots"
    );
  });

  it("ignores source keys that are missing at runtime", () => {
    expect(
      renameKeys(
        { a: 1 },
        [{ from: "missing", to: "value" }] as never
      )
    ).toEqual({ a: 1 });
  });

  it("ignores inherited Object-prototype properties", () => {
    const input: { value: number; toString: () => string } = { value: 1 };
    const result = renameKeys(input, [
      { from: "toString", to: "stringify" },
    ]);

    expect(Object.hasOwn(result, "stringify")).toBe(false);
    expect(result.value).toBe(1);
  });

  it("supports symbol targets", () => {
    const target = Symbol("target");
    expect(renameKeys({ a: 1 }, [{ from: "a", to: target }])).toEqual({
      [target]: 1,
    });
  });

  it("preserves a null prototype without synthesizing inherited values", () => {
    const input = Object.create(null) as {
      value: number;
      toString?: number;
    };
    input.value = 1;
    const result = renameKeys(input, [
      { from: "value", to: "renamed" },
    ]);

    expect(Object.getPrototypeOf(result)).toBeNull();
    expect(result.toString).toBeUndefined();
    expect(result.renamed).toBe(1);
  });

  it("creates __proto__ targets as data properties without prototype mutation", () => {
    const result = renameKeys(
      { value: { safe: true } },
      [{ from: "value", to: "__proto__" }]
    );

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, "__proto__")).toBe(true);
    expect(result.__proto__).toEqual({ safe: true });
    expect(({} as { safe?: boolean }).safe).toBeUndefined();
  });

  it("preserves an existing own __proto__ property when another key is renamed", () => {
    const object = JSON.parse('{"__proto__":"kept","value":1}');
    const result = renameKeys(object, [{ from: "value", to: "renamed" }]);

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, "__proto__")).toBe(true);
    expect(result.__proto__).toBe("kept");
    expect(result.renamed).toBe(1);
  });

  it("uses the source type when a destination replaces an existing key", () => {
    const result = renameKeys(
      { text: "value", count: 1 },
      [{ from: "text", to: "count" }]
    );

    const count: string = result.count;
    expect(count).toBe("value");

    // @ts-expect-error the numeric destination was replaced by the string source
    const staleCount: number = result.count;
    void staleCount;
  });

  it("keeps optional destinations optional when their source may be absent", () => {
    const input: { value?: string } = {};
    const result = renameKeys(input, [{ from: "value", to: "renamed" }]);
    const renamed: string | undefined = result.renamed;

    expect(Object.hasOwn(result, "renamed")).toBe(false);
    void renamed;
  });

  it("preserves unrenamed non-enumerable properties and source enumerability", () => {
    const object = { visible: 1 } as {
      visible: number;
      hidden: number;
      renamedHidden: number;
    };
    Object.defineProperties(object, {
      hidden: { value: 2, enumerable: false },
      renamedHidden: { value: 3, enumerable: false },
    });

    const result = renameKeys(object, [
      { from: "visible", to: "renamedVisible" },
      { from: "renamedHidden", to: "movedHidden" },
    ]);

    expect(result.hidden).toBe(2);
    expect(result.movedHidden).toBe(3);
    expect(Object.keys(result)).toEqual(["renamedVisible"]);
  });

  it("reads getters once before applying duplicate mappings", () => {
    let reads = 0;
    const object = {} as { value: number };
    Object.defineProperty(object, "value", {
      enumerable: true,
      get: () => {
        reads += 1;
        return reads;
      },
    });

    const result = renameKeys(object, [
      { from: "value", to: "first" },
      { from: "value", to: "second" },
    ]);

    expect(result).toEqual({ first: 1, second: 1 });
    expect(reads).toBe(1);
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

    expect(renameKeys(input, [])).toEqual({ first: 1, second: 2 });
  });

  it("rejects arrays and class instances instead of returning misleading types", () => {
    class Example {
      value = 1;
      method() {
        return this.value;
      }
    }

    expect(() => {
      // @ts-expect-error array inputs are intentionally unsupported
      renameKeys([1, 2], [{ from: 0, to: "first" }]);
    }).toThrow(TypeError);
    expect(() =>
      renameKeys(new Example(), [{ from: "value", to: "renamed" }])
    ).toThrow(TypeError);
  });
});
