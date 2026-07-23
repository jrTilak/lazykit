import { describe, expect, it } from "bun:test";
import { stableStringify } from "./stableStringify";

describe("stableStringify", () => {
  it("sorts object keys recursively but preserves array order", () => {
    const first = { z: 1, nested: { b: 2, a: 1 }, values: [{ y: 2, x: 1 }] };
    const second = { values: [{ x: 1, y: 2 }], nested: { a: 1, b: 2 }, z: 1 };
    expect(stableStringify(first)).toBe(stableStringify(second));
    expect(stableStringify(first)).toBe('{"nested":{"a":1,"b":2},"values":[{"x":1,"y":2}],"z":1}');
  });

  it("matches JSON omission, array, number, and toJSON behavior", () => {
    expect(stableStringify({ gone: undefined, nan: NaN, date: new Date("2024-01-01T00:00:00.000Z") })).toBe('{"date":"2024-01-01T00:00:00.000Z","nan":null}');
    expect(stableStringify([undefined, Infinity])).toBe("[null,null]");
    expect(stableStringify(undefined)).toBeUndefined();
  });

  it("supports repeated references but rejects cycles and BigInt", () => {
    const shared = { value: 1 };
    expect(stableStringify({ a: shared, b: shared })).toBe('{"a":{"value":1},"b":{"value":1}}');
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(() => stableStringify(circular)).toThrow(TypeError);
    expect(() => stableStringify(1n)).toThrow(TypeError);
  });

  it("supports JSON indentation", () => {
    expect(stableStringify({ b: 2, a: 1 }, 2)).toContain('\n  "a": 1');
  });

  it("preserves own special keys without changing prototypes", () => {
    expect(stableStringify(JSON.parse('{"__proto__":1}'))).toBe('{"__proto__":1}');
  });
});
