import { describe, expect, it } from "bun:test";
import { mergeDeep } from "./mergeDeep";

describe("mergeDeep", () => {
  it("merges nested plain objects and replaces arrays", () => {
    const base = { user: { name: "Ada", flags: { admin: false } }, tags: ["old"] };
    const override = { user: { flags: { admin: true }, age: 37 }, tags: ["new"] };
    expect(mergeDeep(base, override)).toEqual({ user: { name: "Ada", flags: { admin: true }, age: 37 }, tags: ["new"] });
  });

  it("does not mutate or retain cloneable branches", () => {
    const base = { nested: { a: 1 } };
    const override = { other: { b: 2 } };
    const result = mergeDeep(base, override);
    expect(result.nested).not.toBe(base.nested);
    expect(result.other).not.toBe(override.other);
  });

  it("ignores prototype-polluting properties", () => {
    const unsafe = JSON.parse('{"__proto__":{"polluted":true}}');
    const result = mergeDeep({}, unsafe);
    expect(Object.prototype.hasOwnProperty.call(result, "__proto__")).toBe(false);
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
  });

  it("preserves non-plain object instances", () => {
    const date = new Date();
    expect(mergeDeep({}, { date }).date).toBe(date);
  });
});
