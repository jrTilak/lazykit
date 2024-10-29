// filterObj.test.ts
import { describe, it, expect } from "vitest";
import filterObj from ".";

describe("filterObj", () => {
  it("should return an empty object when input is empty", () => {
    const result = filterObj({}, (value) => true);
    expect(result).toEqual({});
  });

  it("should return the same object when all properties pass the predicate", () => {
    const user = { name: "Alice", age: 25, isActive: true };
    const result = filterObj(user, (value) => true);
    expect(result).toEqual(user);
  });

  it("should filter properties based on custom logic", () => {
    const user = { name: "Charlie", age: 28, isActive: true, role: "editor" };
    const result = filterObj(user, (value, key) => typeof value === "string");
    expect(result).toEqual({ name: "Charlie", role: "editor" });
  });

  it("should return an empty object if no properties match", () => {
    const user = { name: "David", age: 35, isActive: false };
    const result = filterObj(user, (value) => false);
    expect(result).toEqual({});
  });
});
