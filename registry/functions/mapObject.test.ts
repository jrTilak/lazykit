import { describe, expect, it, vi } from "bun:test";
import { mapObject } from "./mapObject";

describe("mapObject", () => {
  it("transforms values while preserving keys", () => {
    expect(mapObject({ a: 1, b: 2 }, (value) => value * 2)).toEqual({
      a: 2,
      b: 4,
    });
  });

  it("passes each value, key, and the original object", () => {
    const object = { a: 1 };
    const transform = vi.fn((value: number) => value);
    mapObject(object, transform);
    expect(transform).toHaveBeenCalledWith(1, "a", object);
  });

  it("returns an empty object for empty input", () => {
    expect(mapObject({}, (value) => value)).toEqual({});
  });

  it("does not mutate the input", () => {
    const object = { a: 1 };
    const result = mapObject(object, (value) => value + 1);
    expect(result).toEqual({ a: 2 });
    expect(object).toEqual({ a: 1 });
  });

  it("ignores inherited and non-enumerable properties", () => {
    const object = Object.create({ inherited: 1 }) as Record<string, number>;
    object.visible = 2;
    Object.defineProperty(object, "hidden", { value: 3, enumerable: false });
    expect(mapObject(object, (value) => value * 2)).toEqual({ visible: 4 });
  });

  it("supports enumerable symbol properties", () => {
    const symbol = Symbol("value");
    expect(mapObject({ [symbol]: 2 }, (value) => value * 3)).toEqual({
      [symbol]: 6,
    });
  });
});
