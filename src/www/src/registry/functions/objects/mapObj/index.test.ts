import { describe, expect, it } from "vitest";
import mapObj from ".";

describe("mapObj", () => {
  it("should map each value in the object using the callback function", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const callback = (value: number) => value * 2;

    const result = mapObj(obj, callback);

    expect(result).toEqual({ a: 2, b: 4, c: 6 });
  });

  it("should handle empty objects", () => {
    const obj = {};
    const callback = (value: any) => value;

    const result = mapObj(obj, callback);

    expect(result).toEqual({});
  });

  it("should handle objects with non-string keys", () => {
    const obj = { 1: "one", 2: "two", 3: "three" };
    const callback = (value: string) => value.toUpperCase();

    const result = mapObj(obj, callback);

    expect(result).toEqual({ 1: "ONE", 2: "TWO", 3: "THREE" });
  });
});
