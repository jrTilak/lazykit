import { describe, expect, it } from "bun:test";
import { renameKeys } from "./renameKeys";

describe("renameKeys", () => {
  it("renames multiple own properties", () => {
    expect(
      renameKeys({ first: "Ada", last: "Lovelace", age: 36 }, [
        { from: "first", to: "firstName" },
        { from: "last", to: "lastName" },
      ])
    ).toEqual({ firstName: "Ada", lastName: "Lovelace", age: 36 });
  });

  it("does not mutate the original object", () => {
    const object = { a: 1, b: 2 };
    renameKeys(object, [{ from: "a", to: "x" }]);
    expect(object).toEqual({ a: 1, b: 2 });
  });

  it("applies mappings simultaneously instead of chaining values", () => {
    expect(
      renameKeys({ a: 1, b: 2 }, [
        { from: "a", to: "b" },
        { from: "b", to: "c" },
      ])
    ).toEqual({ b: 1, c: 2 });
  });

  it("uses the last mapping when targets collide", () => {
    expect(
      renameKeys({ a: 1, b: 2 }, [
        { from: "a", to: "value" },
        { from: "b", to: "value" },
      ])
    ).toEqual({ value: 2 });
  });

  it("ignores source keys that are missing at runtime", () => {
    expect(
      renameKeys(
        { a: 1 },
        [{ from: "missing", to: "value" }] as never
      )
    ).toEqual({ a: 1 });
  });

  it("supports symbol targets", () => {
    const target = Symbol("target");
    expect(renameKeys({ a: 1 }, [{ from: "a", to: target }])).toEqual({
      [target]: 1,
    });
  });
});
