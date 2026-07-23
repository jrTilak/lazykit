import { describe, expect, it } from "bun:test";
import { mergeDeep } from "./mergeDeep";

describe("mergeDeep", () => {
  it("merges nested plain objects and replaces arrays", () => {
    const base = {
      user: { name: "Ada", flags: { admin: false } },
      tags: ["old"],
    };
    const override = {
      user: { flags: { admin: true }, age: 37 },
      tags: ["new"],
    };
    expect(mergeDeep(base, override)).toEqual({
      user: { name: "Ada", flags: { admin: true }, age: 37 },
      tags: ["new"],
    });
  });

  it("does not mutate or retain cloneable branches", () => {
    const base = { nested: { a: 1 } };
    const override = { other: { b: 2 } };
    const result = mergeDeep(base, override);
    expect(result.nested).not.toBe(base.nested);
    expect(result.other).not.toBe(override.other);
  });

  it("preserves special keys as data without prototype pollution", () => {
    const symbol = Symbol("value");
    const unsafe = JSON.parse(
      '{"__proto__":{"safe":true},"constructor":{"prototype":{"polluted":true}}}'
    );
    unsafe[symbol] = 1;
    const result = mergeDeep({}, unsafe);

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, "__proto__")).toBe(true);
    expect(result.__proto__).toEqual({ safe: true });
    expect(result.constructor).toEqual({ prototype: { polluted: true } });
    expect(result[symbol]).toBe(1);
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
  });

  it("preserves non-plain object instances", () => {
    const date = new Date();
    expect(mergeDeep({}, { date }).date).toBe(date);
  });

  it("replaces arrays and preserves their holes, metadata, and cycles", () => {
    const symbol = Symbol("metadata");
    const values = new Array(2) as unknown[] & {
      label?: string;
      [symbol]?: number;
    };
    values[1] = values;
    values.label = "items";
    values[symbol] = 1;

    const result = mergeDeep({ values: ["old"] }, { values });

    expect(result.values).not.toBe(values);
    expect(0 in result.values).toBe(false);
    expect(result.values[1]).toBe(result.values);
    expect(result.values.label).toBe("items");
    expect(result.values[symbol]).toBe(1);
  });

  it("preserves circular references in merged plain objects", () => {
    const base: { base: number; self?: unknown } = { base: 1 };
    const override: { override: number; self?: unknown } = { override: 2 };
    base.self = base;
    override.self = override;

    const result = mergeDeep(base, override);

    expect(result.base).toBe(1);
    expect(result.override).toBe(2);
    expect(result.self).toBe(result);
  });

  it("keeps circular references local to each merged object pair", () => {
    const shared: { value: number; self?: unknown } = { value: 1 };
    shared.self = shared;

    const result = mergeDeep(
      { first: shared, second: shared },
      { first: { firstOnly: true }, second: { secondOnly: true } }
    );

    expect(result.first.self).toBe(result.first);
    expect(result.second.self).toBe(result.second);
    expect(result.first).not.toBe(result.second);
  });

  it("keeps indirect back-references local to each merged object pair", () => {
    const shared: {
      child: { parent?: unknown };
    } = { child: {} };
    shared.child.parent = shared;

    const result = mergeDeep(
      { first: shared, second: shared },
      { first: { firstOnly: true }, second: { secondOnly: true } }
    );

    expect(result.first.child.parent).toBe(result.first);
    expect(result.second.child.parent).toBe(result.second);
    expect(result.first.child).not.toBe(result.second.child);
  });

  it("uses override types instead of intersecting conflicting properties", () => {
    const result = mergeDeep(
      { value: 1, nested: { keep: true, value: 1 }, list: [1] },
      { value: "one", nested: { value: "one" }, list: ["one"] }
    );

    const value: string = result.value;
    const nestedValue: string = result.nested.value;
    const kept: boolean = result.nested.keep;
    const item: string | undefined = result.list[0];
    void [value, nestedValue, kept, item];

    // @ts-expect-error the override replaced the number with a string
    const staleValue: number = result.value;
    void staleValue;
  });

  it("replaces plain roots when the base is not plain", () => {
    const result = mergeDeep(new Date(), { enabled: true });
    expect(result).toEqual({ enabled: true });
    expect(result.enabled).toBe(true);
  });

  it("replaces arbitrary class instances in either position", () => {
    class Box {
      constructor(readonly value: number) {}
    }

    const overrideWins = mergeDeep(new Box(1), { enabled: true });
    expect(overrideWins).toEqual({ enabled: true });
    expect(overrideWins).not.toBeInstanceOf(Box);

    const classWins = mergeDeep({ enabled: true }, new Box(2));
    expect(classWins).toBeInstanceOf(Box);
    expect(classWins.value).toBe(2);
    expect("enabled" in classWins).toBe(false);
  });

  it("merges every own key and preserves property visibility and symbols", () => {
    const symbol = Symbol("metadata");
    const base = {
      hidden: { base: true },
      visible: true,
      [symbol]: { base: true },
    };
    Object.defineProperty(base, "hidden", {
      value: { base: true },
      enumerable: false,
      configurable: false,
      writable: false,
    });
    const override = {
      hidden: { override: true },
      added: "value",
      [symbol]: { override: true },
    };
    Object.defineProperty(override, "hidden", {
      value: { override: true },
      enumerable: false,
      configurable: false,
      writable: false,
    });
    Object.defineProperty(override, "added", {
      value: "value",
      enumerable: false,
      configurable: true,
      writable: false,
    });

    const result = mergeDeep(base, override);

    expect(result.hidden).toEqual({ base: true, override: true });
    expect(result[symbol]).toEqual({ base: true, override: true });
    expect(result.added).toBe("value");
    expect(Object.keys(result)).toEqual(["visible"]);
    expect(Object.getOwnPropertyDescriptor(result, "hidden")).toMatchObject({
      enumerable: false,
      configurable: false,
      writable: false,
    });
    expect(Object.getOwnPropertyDescriptor(result, "added")).toMatchObject({
      enumerable: false,
      configurable: true,
      writable: false,
    });
  });

  it("snapshots both inputs before getters can delete required keys", () => {
    const override = {} as { required: number };
    Object.defineProperty(override, "required", {
      enumerable: true,
      configurable: true,
      get: () => 2,
    });

    const base = {} as { trigger: number };
    Object.defineProperty(base, "trigger", {
      enumerable: true,
      get: () => {
        Reflect.deleteProperty(override, "required");
        return 1;
      },
    });

    const result = mergeDeep(base, override);

    expect(result).toEqual({ trigger: 1, required: 2 });
    expect(Object.hasOwn(override, "required")).toBe(false);
  });
});
