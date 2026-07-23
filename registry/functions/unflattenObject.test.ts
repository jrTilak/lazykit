import { describe, expect, it } from "bun:test";
import { unflattenObject } from "./unflattenObject";

describe("unflattenObject", () => {
  it("expands dot-delimited keys", () => {
    expect(unflattenObject({ "user.name": "Ada", "user.address.city": "London", active: true })).toEqual({ user: { name: "Ada", address: { city: "London" } }, active: true });
  });

  it("preserves empty objects and arrays as leaf values", () => {
    expect(unflattenObject({ nested: {}, values: [] })).toEqual({ nested: {}, values: [] });
  });

  it("rejects empty, unsafe, and conflicting paths", () => {
    expect(() => unflattenObject({ "a..b": 1 })).toThrow(TypeError);
    expect(() => unflattenObject({ "__proto__.value": 1 })).toThrow(TypeError);
    expect(() => unflattenObject({ a: 1, "a.b": 2 })).toThrow(TypeError);
    expect(() => unflattenObject({ "a.b": 2, a: 1 })).toThrow(TypeError);
  });
});
