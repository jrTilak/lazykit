import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";
import { debounce } from "./debounce";

describe("debounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("waits for the configured delay", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced("value");
    vi.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledWith("value");
  });

  it("resets the delay and keeps the latest arguments", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced("first");
    vi.advanceTimersByTime(50);
    debounced("second");
    vi.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("second");
  });

  it("reports pending state across the call lifecycle", () => {
    const debounced = debounce(() => undefined, 10);
    expect(debounced.pending()).toBe(false);
    debounced();
    expect(debounced.pending()).toBe(true);
    vi.advanceTimersByTime(10);
    expect(debounced.pending()).toBe(false);
  });

  it("cancels a pending call", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 10);
    debounced();
    debounced.cancel();
    vi.advanceTimersByTime(10);
    expect(fn).not.toHaveBeenCalled();
    expect(debounced.pending()).toBe(false);
  });

  it("flushes a pending call immediately and only once", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 10);
    debounced("now");
    debounced.flush();
    expect(fn).toHaveBeenCalledWith("now");
    vi.advanceTimersByTime(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("allows a new cycle after invoking", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 10);
    debounced(1);
    vi.advanceTimersByTime(10);
    debounced(2);
    vi.advanceTimersByTime(10);
    expect(fn.mock.calls).toEqual([[1], [2]]);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid delay %p",
    (delay) => expect(() => debounce(() => undefined, delay)).toThrow(RangeError)
  );

  it("accepts a zero delay", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 0);
    debounced();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
