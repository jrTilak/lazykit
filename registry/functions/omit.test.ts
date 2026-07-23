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

  it("preserves a null prototype without synthesizing inherited values", () => {
    const input = Object.create(null) as {
      value: number;
      toString?: number;
    };
    input.value = 1;
    const result = omit(input, ["value"]);

    expect(Object.getPrototypeOf(result)).toBeNull();
    expect(result.toString).toBeUndefined();
  });

  it("rejects sparse key lists before returning a misleading shape", () => {
    const keys = new Array<"a">(1);
    expect(() => omit({ a: 1, b: 2 }, keys)).toThrow(
      "keys must not contain empty slots"
    );
  });

  it("supports symbol keys", () => {
    const hidden = Symbol("hidden");
    expect(omit({ [hidden]: 1, visible: 2 }, [hidden])).toEqual({ visible: 2 });
  });

  it("preserves unselected non-enumerable own properties", () => {
    const object = { visible: 1 } as { visible: number; hidden: number };
    Object.defineProperty(object, "hidden", {
      value: 2,
      enumerable: false,
    });

    const result = omit(object, ["visible"]);

    expect(result.hidden).toBe(2);
    expect(Object.keys(result)).toEqual([]);
  });

  it("snapshots later data properties before an earlier getter deletes them", () => {
    const input = {} as { first: number; second: number };
    Object.defineProperties(input, {
      first: {
        enumerable: true,
        get: () => {
          Reflect.deleteProperty(input, "second");
          return 1;
        },
      },
      second: { value: 2, enumerable: true, configurable: true },
    });

    expect(omit(input, [])).toEqual({ first: 1, second: 2 });
  });

  it("rejects arrays and class instances instead of returning misleading types", () => {
    class Example {
      value = 1;
      method() {
        return this.value;
      }
    }

    expect(() => {
      // @ts-expect-error array inputs are intentionally unsupported
      omit([1, 2], [0]);
    }).toThrow(TypeError);
    expect(() => omit(new Example(), [])).toThrow(TypeError);
  });
});
