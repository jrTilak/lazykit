import { describe, expect, it, vi } from "bun:test";
import { filterObject } from "./filterObject";

describe("filterObject", () => {
  it("keeps properties whose predicate returns true", () => {
    expect(filterObject({ a: 1, b: 2, c: 3 }, (value) => value > 1)).toEqual({
      b: 2,
      c: 3,
    });
  });

  it("passes each value, key, and the original object", () => {
    const object = { a: 1 };
    const predicate = vi.fn(() => true);
    filterObject(object, predicate);
    expect(predicate).toHaveBeenCalledWith(1, "a", object);
  });

  it("handles empty objects and no matches", () => {
    expect(filterObject({}, () => true)).toEqual({});
    expect(filterObject({ a: 1 }, () => false)).toEqual({});
  });

  it("does not mutate the input", () => {
    const object = { a: 1, b: 2 };
    const result = filterObject(object, () => true);
    expect(result).toEqual(object);
    expect(result).not.toBe(object);
    expect(object).toEqual({ a: 1, b: 2 });
  });

  it("ignores inherited and non-enumerable properties", () => {
    const object = Object.create({ inherited: 1 }) as Record<string, number>;
    object.visible = 2;
    Object.defineProperty(object, "hidden", { value: 3, enumerable: false });
    expect(filterObject(object, () => true)).toEqual({ visible: 2 });
  });

  it("supports enumerable symbol properties", () => {
    const symbol = Symbol("value");
    const object = { [symbol]: 1, visible: 2 };
    expect(filterObject(object, (_, key) => key === symbol)).toEqual({
      [symbol]: 1,
    });
  });
});
