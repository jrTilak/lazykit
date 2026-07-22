import { afterEach, describe, expect, it, vi } from "bun:test";
import { throttle } from "./throttle";

const originalNow = Date.now;

describe("throttle", () => {
  afterEach(() => {
    Date.now = originalNow;
  });

  it("runs the first call immediately and returns its result", () => {
    Date.now = () => 1_000;
    const fn = vi.fn((value: number) => value * 2);
    const throttled = throttle(fn, 100);
    expect(throttled(2)).toBe(4);
    expect(fn).toHaveBeenCalledWith(2);
  });

  it("drops calls inside the interval", () => {
    let now = 1_000;
    Date.now = () => now;
    const fn = vi.fn((value: string) => value);
    const throttled = throttle(fn, 100);
    expect(throttled("first")).toBe("first");
    now = 1_099;
    expect(throttled("dropped")).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("runs again at the exact interval boundary", () => {
    let now = 1_000;
    Date.now = () => now;
    const fn = vi.fn();
    const throttled = throttle(fn, 100);
    throttled();
    now = 1_100;
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("reset allows an immediate call", () => {
    Date.now = () => 1_000;
    const fn = vi.fn();
    const throttled = throttle(fn, 100);
    throttled();
    throttled.reset();
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("runs every call when intervalMs is zero", () => {
    Date.now = () => 1_000;
    const fn = vi.fn();
    const throttled = throttle(fn, 0);
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("recovers if the system clock moves backwards", () => {
    let now = 1_000;
    Date.now = () => now;
    const fn = vi.fn();
    const throttled = throttle(fn, 100);
    throttled();
    now = 900;
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid interval %p",
    (interval) => expect(() => throttle(() => undefined, interval)).toThrow(RangeError)
  );
});
