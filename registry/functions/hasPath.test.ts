import { describe, expect, it } from "bun:test";
import { hasPath } from "./hasPath";

describe("hasPath", () => {
  it("distinguishes present undefined values from missing values", () => {
    expect(hasPath({ value: undefined }, "value")).toBe(true);
    const missing: string = "missing";
    expect(hasPath({ value: undefined }, missing)).toBe(false);
  });

  it("supports dot paths, arrays, and symbols", () => {
    const symbol = Symbol("key");
    const input = { nested: [{ value: 1 }], [symbol]: true };
    expect(hasPath(input, "nested.0.value")).toBe(true);
    expect(hasPath(input, [symbol])).toBe(true);
  });

  it("treats the empty path as the root and ignores inheritance", () => {
    expect(hasPath(null, "")).toBe(true);
    expect(hasPath(Object.create({ value: 1 }), "value")).toBe(false);
  });

  it("checks literal paths while accepting explicitly dynamic paths", () => {
    const input = { user: { name: "Ada" }, values: [1] };
    expect(hasPath(input, ["user", "name"])).toBe(true);

    // @ts-expect-error literal paths are checked against the input type
    hasPath(input, "user.missing");

    const dynamicPath: string = "user.missing";
    expect(hasPath(input, dynamicPath)).toBe(false);
  });

  it("supports typed own array metadata without admitting inherited methods", () => {
    const metadata = Symbol("metadata");
    const values = [1] as number[] & {
      label: string;
      [metadata]: boolean;
    };
    values.label = "numbers";
    values[metadata] = true;

    expect(hasPath(values, "label")).toBe(true);
    expect(hasPath(values, [metadata])).toBe(true);

    const inheritedMethod: string = "map";
    expect(hasPath(values, inheritedMethod)).toBe(false);
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

    expect(hasPath(values, [4_294_967_294])).toBe(true);
    const propertyPath: PropertyKey[] = ["4294967295"];
    expect(hasPath(values, propertyPath)).toBe(true);
  });

  it("does not type built-in prototype members as own paths", () => {
    const map = new Map<string, number>();
    const inheritedPath: string = "size";
    expect(hasPath(map, inheritedPath)).toBe(false);

    const labeled = map as Map<string, number> & { label: string };
    labeled.label = "values";
    expect(hasPath(labeled, "label")).toBe(true);

    // @ts-expect-error Map#size is inherited, not an own property
    hasPath(map, "size");
  });
});
