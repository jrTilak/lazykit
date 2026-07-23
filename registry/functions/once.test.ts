import { describe, expect, it, vi } from "bun:test";
import { once } from "./once";

describe("once", () => {
  it("invokes the function once and reuses its first result", () => {
    const fn = vi.fn((value: number) => value * 2);
    const runOnce = once(fn);
    expect(runOnce(2)).toBe(4);
    expect(runOnce(10)).toBe(4);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(2);
  });

  it("caches undefined results", () => {
    const fn = vi.fn(() => undefined);
    const runOnce = once(fn);
    expect(runOnce()).toBeUndefined();
    expect(runOnce()).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("rethrows the same error without invoking again", () => {
    const error = new Error("failed");
    const fn = vi.fn(() => {
      throw error;
    });
    const runOnce = once(fn);
    expect(runOnce).toThrow(error);
    expect(runOnce).toThrow(error);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("caches the same promise for asynchronous functions", () => {
    const fn = vi.fn(async () => "done");
    const runOnce = once(fn);
    const first = runOnce();
    const second = runOnce();
    expect(second).toBe(first);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("blocks recursive invocation and caches that error", () => {
    let runOnce: () => unknown;
    runOnce = once(() => runOnce());
    expect(runOnce).toThrow("once callback cannot invoke itself recursively");
    expect(runOnce).toThrow("once callback cannot invoke itself recursively");
  });

  it("uses the receiver from the first invocation", () => {
    const readOnce = once(function (this: { value: number }) {
      return this.value;
    });

    expect(readOnce.call({ value: 1 })).toBe(1);
    expect(readOnce.call({ value: 2 })).toBe(1);
  });
});
