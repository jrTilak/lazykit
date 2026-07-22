import { describe, expect, it } from "bun:test";
import { pick } from "./pick";

describe("pick", () => {
  it("copies only the selected properties", () => {
    expect(pick({ name: "Alice", age: 30, city: "Paris" }, ["name", "age"])).toEqual({
      name: "Alice",
      age: 30,
    });
  });

  it("returns an empty object for an empty key list", () => {
    expect(pick({ a: 1 }, [])).toEqual({});
  });

  it("does not mutate the original object", () => {
    const object = { a: 1, b: 2 };
    pick(object, ["a"]);
    expect(object).toEqual({ a: 1, b: 2 });
  });

  it("accepts duplicate keys", () => {
    expect(pick({ a: 1, b: 2 }, ["a", "a"])).toEqual({ a: 1 });
  });

  it("supports symbol keys", () => {
    const symbol = Symbol("selected");
    expect(pick({ [symbol]: 1, visible: 2 }, [symbol])).toEqual({
      [symbol]: 1,
    });
  });
});
