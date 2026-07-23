import { describe, expect, it } from "bun:test";
import { compactObject } from "./compactObject";

describe("compactObject", () => {
  it("recursively removes nullish values while preserving other falsy values", () => {
    expect(compactObject({ a: null, b: undefined, c: 0, d: false, nested: { empty: "", gone: null }, values: [0, null, false, undefined] })).toEqual({ c: 0, d: false, nested: { empty: "" }, values: [0, false] });
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
    class Box {}
    const date = new Date();
    const box = new Box();
    const result = compactObject({ date, box });
    expect(result.date).toBe(date);
    expect(result.box).toBe(box);
  });
});
