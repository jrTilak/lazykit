import { describe, expect, it } from "bun:test";
import { compactObject } from "./compactObject";

describe("compactObject", () => {
  it("recursively removes nullish values while preserving other falsy values", () => {
    expect(
      compactObject({
        a: null,
        b: undefined,
        c: 0,
        d: false,
        nested: { empty: "", gone: null },
        values: [0, null, false, undefined],
      })
    ).toEqual({
      c: 0,
      d: false,
      nested: { empty: "" },
      values: [0, false],
    });
  });

  it("does not mutate input", () => {
    const input = { nested: { value: 1 } };
    const result = compactObject(input);
    expect(result).toEqual(input);
    expect(result).not.toBe(input);
    expect(result.nested).not.toBe(input.nested);
  });

  it("preserves circular structure", () => {
    const input: { self?: unknown; gone: null } = { gone: null };
    input.self = input;
    const result = compactObject(input);
    expect(result.self).toBe(result);
  });

  it("preserves dates and class instances as leaf values", () => {
    class Box {
      value: string | null = null;
    }
    const date = new Date();
    const box = new Box();
    const result = compactObject({ date, box });
    expect(result.date).toBe(date);
    expect(result.box).toBe(box);
    expect(result.box.value).toBeNull();
  });

  it("preserves special and symbol keys as safe data properties", () => {
    const symbol = Symbol("value");
    const input = JSON.parse(
      '{"__proto__":{"kept":true},"constructor":null}'
    ) as Record<PropertyKey, unknown>;
    input[symbol] = { keep: 1, remove: undefined };

    const result = compactObject(input);

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, "__proto__")).toBe(true);
    expect(result.__proto__).toEqual({ kept: true });
    expect(Object.hasOwn(result, "constructor")).toBe(false);
    expect(result[symbol]).toEqual({ keep: 1 });
    expect(({} as { kept?: boolean }).kept).toBeUndefined();
  });

  it("removes sparse array holes and preserves enumerable array metadata", () => {
    const symbol = Symbol("metadata");
    const values = new Array(3) as Array<number | null> & {
      label?: string;
      [symbol]?: { gone: null; kept: number };
    };
    values[1] = 2;
    values.label = "numbers";
    values[symbol] = { gone: null, kept: 1 };

    const result = compactObject(values);

    expect(result.length).toBe(1);
    expect(result[0]).toBe(2);
    expect(result.label).toBe("numbers");
    expect(result[symbol]).toEqual({ kept: 1 });
  });

  it("ignores values inherited into sparse array slots", () => {
    Object.defineProperty(Array.prototype, "0", {
      value: "inherited",
      configurable: true,
      writable: true,
    });
    try {
      const input = new Array(1) as string[];
      expect(compactObject(input)).toEqual([]);
    } finally {
      Reflect.deleteProperty(Array.prototype, "0");
    }
  });

  it("preserves non-enumerable properties when their values remain", () => {
    const input = {} as { hidden: { kept: number; gone?: null } };
    Object.defineProperty(input, "hidden", {
      value: { kept: 1, gone: null },
      enumerable: false,
    });

    const result = compactObject(input);

    expect(result.hidden).toEqual({ kept: 1 });
    expect(Object.keys(result)).toEqual([]);
  });

  it("snapshots later data properties before an earlier getter deletes them", () => {
    const input = {} as {
      first: { kept: number };
      second: { kept: number };
    };
    Object.defineProperties(input, {
      first: {
        enumerable: true,
        get: () => {
          Reflect.deleteProperty(input, "second");
          return { kept: 1 };
        },
      },
      second: {
        value: { kept: 2 },
        enumerable: true,
        configurable: true,
      },
    });

    expect(compactObject(input)).toEqual({
      first: { kept: 1 },
      second: { kept: 2 },
    });
  });

  it("reflects removed and maybe-removed properties in its return type", () => {
    const compacted = compactObject({
      removed: null,
      maybe: null as string | null,
      nested: { removed: undefined, kept: 1 },
      values: [1, null] as Array<number | null>,
    });

    const maybe: string | undefined = compacted.maybe;
    const kept: number = compacted.nested.kept;
    const item: number | undefined = compacted.values[0];
    void [maybe, kept, item];

    // @ts-expect-error nullish-only keys are absent from the result type
    compacted.removed;
    // @ts-expect-error nested nullish-only keys are absent too
    compacted.nested.removed;
  });
});
