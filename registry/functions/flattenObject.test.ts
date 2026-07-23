import { describe, expect, it } from "bun:test";
import { flattenObject } from "./flattenObject";

describe("flattenObject", () => {
  it("flattens nested plain objects while leaving arrays and dates intact", () => {
    const date = new Date();
    expect(flattenObject({ user: { name: "Ada", address: { city: "London" } }, values: [1], date })).toEqual({ "user.name": "Ada", "user.address.city": "London", values: [1], date });
  });

  it("preserves empty nested objects", () => {
    expect(flattenObject({ nested: {} })).toEqual({ nested: {} });
    expect(flattenObject({})).toEqual({});
  });

  it("rejects ambiguous and circular objects", () => {
    expect(() => flattenObject({ "a.b": 1 })).toThrow(TypeError);
    expect(() => flattenObject(JSON.parse('{"__proto__":1}'))).toThrow(TypeError);
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(() => flattenObject(circular)).toThrow(TypeError);
  });
});
