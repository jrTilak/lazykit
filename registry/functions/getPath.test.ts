import { describe, expect, it } from "bun:test";
import { getPath } from "./getPath";

describe("getPath", () => {
  const symbol = Symbol("value");
  const input = { user: { profile: { name: "Ada" }, values: [10] }, undefinedValue: undefined, [symbol]: 42 };

  it("reads dot paths and array indexes", () => {
    expect(getPath(input, "user.profile.name")).toBe("Ada");
    expect(getPath(input, "user.values.0")).toBe(10);
  });

  it("supports segment arrays and symbols", () => {
    expect(getPath(input, [symbol])).toBe(42);
    expect(getPath(input, ["user", "profile"])).toEqual({ name: "Ada" });
  });

  it("uses defaults for missing and undefined values", () => {
    const missingPath: string = "missing.path";
    expect(getPath(input, missingPath, "fallback")).toBe("fallback");
    expect(getPath(input, "undefinedValue", "fallback")).toBe("fallback");
    expect(getPath(input, "undefinedValue")).toBeUndefined();
    expect(getPath(input, "undefinedValue", undefined)).toBeUndefined();
  });

  it("returns the root for an empty path and ignores inherited values", () => {
    expect(getPath(input, "")).toBe(input);
    expect(getPath(Object.create({ inherited: true }), "inherited")).toBeUndefined();
  });

  it("infers dot, tuple, symbol, optional, and fallback result types", () => {
    const optional: { user?: { name: string } } = {};
    const name: string = getPath(input, "user.profile.name");
    const first: number | undefined = getPath(input, ["user", "values", 0]);
    const symbolValue: number = getPath(input, [symbol]);
    const maybeName: string | undefined = getPath(optional, "user.name");
    const withFallback: string = getPath(optional, "user.name", "anonymous");
    void [name, first, symbolValue, maybeName, withFallback];

    // @ts-expect-error literal paths are checked against the input type
    getPath(input, "user.profle.name");

    const dynamicPath: string = "user.profile.name";
    const dynamic: unknown = getPath(input, dynamicPath);
    void dynamic;

    const index: number = 10;
    const indexed: unknown = getPath(input.user.values, [index]);
    const indexedWithDefault: unknown = getPath(
      input.user.values,
      [index],
      0
    );
    void [indexed, indexedWithDefault];
  });

  it("requires a supplied fallback before removing undefined from the type", () => {
    const optional: { user?: { name: string } } = {};
    const withoutDefault: string | undefined = getPath(optional, "user.name");
    const withDefault: string = getPath(optional, "user.name", "anonymous");
    void [withoutDefault, withDefault];

    // @ts-expect-error an explicit fallback generic still requires an argument
    getPath<typeof optional, "user.name", string>(optional, "user.name");
    getPath<typeof optional, "user.name", string>(
      optional,
      "user.name",
      // @ts-expect-error undefined does not satisfy an explicitly selected string fallback
      undefined
    );
  });

  it("reads typed own array metadata but ignores inherited methods", () => {
    const metadata = Symbol("metadata");
    const values = [1] as number[] & {
      label: string;
      [metadata]: boolean;
    };
    values.label = "numbers";
    values[metadata] = true;

    expect(getPath(values, "label")).toBe("numbers");
    expect(getPath(values, [metadata])).toBe(true);

    const inheritedMethod: string = "map";
    expect(getPath(values, inheritedMethod)).toBeUndefined();
  });

  it("distinguishes the last array index from numeric-like properties", () => {
    const values: string[] = [];
    values[4_294_967_294] = "last";
    Object.defineProperty(values, "4294967295", {
      value: "property",
      enumerable: true,
      configurable: true,
      writable: true,
    });

    expect(getPath(values, [4_294_967_294])).toBe("last");
    const propertyPath: PropertyKey[] = ["4294967295"];
    expect(getPath(values, propertyPath)).toBe("property");
  });

  it("does not type built-in prototype members as own paths", () => {
    const date = new Date();
    const inheritedPath: string = "getTime";
    expect(getPath(date, inheritedPath)).toBeUndefined();

    const labeled = date as Date & { label: string };
    labeled.label = "created";
    expect(getPath(labeled, "label")).toBe("created");

    // @ts-expect-error Date#getTime is inherited, not an own property
    getPath(date, "getTime");
  });
});
