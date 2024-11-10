import { describe, expect, it } from "vitest";
import deepCompare from ".";

describe("deepCompare", () => {
  it("should return true for strictly equal primitive values", () => {
    expect(deepCompare(42, 42)).toBe(true); // number
    expect(deepCompare("hello", "hello")).toBe(true); // string
    expect(deepCompare(true, true)).toBe(true); // boolean
  });

  it("should return false for different primitive values", () => {
    expect(deepCompare(42, 43)).toBe(false);
    expect(deepCompare("hello", "world")).toBe(false);
    expect(deepCompare(true, false)).toBe(false);
  });

  it("should return true for equal objects", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };
    expect(deepCompare(obj1, obj2)).toBe(true);
  });

  it("should return false for objects with different values", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 3 };
    expect(deepCompare(obj1, obj2)).toBe(false);
  });

  it("should return true for equal arrays", () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    expect(deepCompare(arr1, arr2)).toBe(true);
  });

  it("should return false for arrays with different values", () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 4];
    expect(deepCompare(arr1, arr2)).toBe(false);
  });

  it("should return false for different types (primitive vs object)", () => {
    expect(deepCompare(42, { a: 42 })).toBe(false);
    expect(deepCompare({ a: 42 }, 42)).toBe(false);
  });

  it("should return true for null and undefined (strict equality)", () => {
    expect(deepCompare(null, null)).toBe(true);
    expect(deepCompare(undefined, undefined)).toBe(true);
  });

  it("should return false for null and undefined (different types)", () => {
    expect(deepCompare(null, undefined)).toBe(false);
    expect(deepCompare(undefined, null)).toBe(false);
  });

  it("should handle edge cases like empty objects and arrays", () => {
    expect(deepCompare({}, {}, {})).toBe(true); // Multiple empty objects
    expect(deepCompare([], [], [])).toBe(true); // Multiple empty arrays
  });

  it("should return false for circular references (this may not be handled by the function currently)", () => {
    const obj1: any = { a: 1 };
    obj1.self = obj1; // Circular reference
    const obj2 = { a: 1 };
    expect(deepCompare(obj1, obj2)).toBe(false); // Should fail because circular references are not handled by JSON.stringify
  });

  it("should return true for multiple identical objects or arrays", () => {
    const obj = { a: 1 };
    const arr = [1, 2, 3];
    expect(deepCompare(obj, obj)).toBe(true); // Same reference
    expect(deepCompare(arr, arr)).toBe(true); // Same reference
    expect(deepCompare({ a: 1 }, { a: 1 }, { a: 1 })).toBe(true); // Multiple equal objects
  });

  it("should return false if comparing more than two values with differences", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 3 };
    const obj3 = { a: 1, b: 2 };
    expect(deepCompare(obj1, obj2, obj3)).toBe(false); // The second and third objects differ
  });

  it("should return true for deeply equal objects and arrays with multiple values", () => {
    const obj1 = { a: { b: 2 }, c: [1, 2, 3] };
    const obj2 = { a: { b: 2 }, c: [1, 2, 3] };
    const obj3 = { a: { b: 2 }, c: [1, 2, 3] };
    expect(deepCompare(obj1, obj2, obj3)).toBe(true); // All objects are deeply equal
  });
});
