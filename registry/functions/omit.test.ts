import { describe, expect, it } from "bun:test";
import { omit } from "./omit";

describe("omit", () => {
  it("copies an object without the selected keys", () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ b: 2 });
  });

  it("returns a shallow clone when no keys are supplied", () => {
    const nested = { value: 1 };
    const object = { nested };
    const result = omit(object, []);
    expect(result).toEqual(object);
    expect(result).not.toBe(object);
    expect(result.nested).toBe(nested);
  });

  it("does not mutate the original object", () => {
    const object = { a: 1, b: 2 };
    omit(object, ["a"]);
    expect(object).toEqual({ a: 1, b: 2 });
  });

  it("accepts duplicate keys", () => {
    expect(omit({ a: 1, b: 2 }, ["a", "a"])).toEqual({ b: 2 });
  });

  it("supports symbol keys", () => {
    const hidden = Symbol("hidden");
    expect(omit({ [hidden]: 1, visible: 2 }, [hidden])).toEqual({ visible: 2 });
  });
});
