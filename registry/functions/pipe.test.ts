import { describe, expect, it } from "bun:test";
import { pipe } from "./pipe";

describe("pipe", () => {
  it("passes transformed values from left to right", () => {
    const result = pipe(2, (value) => value + 1, (value) => String(value), (value) => `#${value}`);
    expect(result).toBe("#3");
  });

  it("returns the original value without functions", () => {
    const value = {};
    expect(pipe(value)).toBe(value);
  });

  it("supports chains longer than five transformations", () => {
    expect(pipe(
      1,
      (value) => value + 1,
      (value) => value * 2,
      String,
      (value) => value.padStart(2, "0"),
      (value) => `[${value}]`,
      (value) => value.length
    )).toBe(4);
  });

  it("stops and forwards thrown errors", () => {
    let reached = false;
    expect(() => pipe(1, () => { throw new Error("stop"); }, () => { reached = true; })).toThrow("stop");
    expect(reached).toBe(false);
  });
});
