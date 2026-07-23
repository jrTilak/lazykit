import { describe, expect, it } from "bun:test";
import { promiseAllObject } from "./promiseAllObject";

describe("promiseAllObject", () => {
  it("resolves values while preserving string and symbol keys", async () => {
    const symbol = Symbol("value");
    const result = await promiseAllObject({
      first: Promise.resolve(1),
      second: 2,
      [symbol]: Promise.resolve(3),
    });
    expect(result).toEqual({ first: 1, second: 2, [symbol]: 3 });
  });

  it("resolves non-enumerable own properties so the result matches the source shape", async () => {
    const input = { visible: Promise.resolve(1) };
    Object.defineProperty(input, "hidden", {
      value: Promise.resolve(2),
      enumerable: false,
    });
    const result = await promiseAllObject(input);
    expect(result).toEqual({ visible: 1, hidden: 2 });
    expect(Object.getOwnPropertyDescriptor(result, "hidden")?.enumerable).toBe(true);
  });

  it("rejects when any value rejects", async () => {
    await expect(
      promiseAllObject({ value: Promise.reject(new Error("failed")) })
    ).rejects.toThrow("failed");
  });

  it("preserves special own keys safely", async () => {
    const input = JSON.parse('{"__proto__":1}') as Record<string, number>;
    const result = await promiseAllObject(input);
    expect(Object.prototype.hasOwnProperty.call(result, "__proto__")).toBe(true);
    expect(result.__proto__).toBe(1);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });

  it("accepts null-prototype records", async () => {
    const input = Object.create(null) as {
      value: Promise<number>;
      toString?: Promise<number>;
    };
    input.value = Promise.resolve(42);
    const result = await promiseAllObject(input);

    expect(Object.getPrototypeOf(result)).toBeNull();
    expect(result.value).toBe(42);
    expect(result.toString).toBeUndefined();
  });

  it("rejects arrays, functions, and non-plain object instances", async () => {
    class Box {
      value = Promise.resolve(1);
    }

    const unsupported: object[] = [
      [],
      (() => undefined) as unknown as object,
      new Box(),
      new Date(),
      Object.create({ inherited: true }) as object,
      Object.create(Object.create(null)) as object,
    ];

    for (const value of unsupported) {
      await expect(promiseAllObject(value)).rejects.toThrow(
        "promiseAllObject expects a plain object"
      );
    }
  });

  it("rejects when reading an own property throws", async () => {
    const input = {};
    Object.defineProperty(input, "value", {
      enumerable: true,
      get() {
        throw new Error("unreadable");
      },
    });
    await expect(promiseAllObject(input)).rejects.toThrow("unreadable");
  });

  it("snapshots later data properties before an earlier getter deletes them", async () => {
    const input = {} as {
      first: Promise<number>;
      second: Promise<number>;
    };
    Object.defineProperties(input, {
      first: {
        enumerable: true,
        get: () => {
          Reflect.deleteProperty(input, "second");
          return Promise.resolve(1);
        },
      },
      second: {
        value: Promise.resolve(2),
        enumerable: true,
        configurable: true,
      },
    });

    await expect(promiseAllObject(input)).resolves.toEqual({
      first: 1,
      second: 2,
    });
  });

  it("rejects a callable resolved then property instead of assimilating its result", async () => {
    const input = {
      then: Promise.resolve(() => undefined),
    } as unknown as object;
    await expect(promiseAllObject(input)).rejects.toThrow(
      "promiseAllObject cannot return an object with a callable then property"
    );
  });

  it("preserves a non-callable then property", async () => {
    expect(
      await promiseAllObject({ then: Promise.resolve("not callable") })
    ).toEqual({ then: "not callable" });
  });
});
