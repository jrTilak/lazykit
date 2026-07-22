import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";
import { sleep } from "./sleep";

describe("sleep", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("resolves with undefined after the requested delay", async () => {
    let settled = false;
    const promise = sleep(100).then((value) => {
      settled = true;
      return value;
    });
    vi.advanceTimersByTime(99);
    await Promise.resolve();
    expect(settled).toBe(false);
    vi.advanceTimersByTime(1);
    await expect(promise).resolves.toBeUndefined();
  });

  it("accepts zero but still resolves asynchronously", async () => {
    let settled = false;
    const promise = sleep(0).then(() => {
      settled = true;
    });
    await Promise.resolve();
    expect(settled).toBe(false);
    vi.advanceTimersByTime(0);
    await promise;
    expect(settled).toBe(true);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid delay %p",
    (delay) => expect(() => sleep(delay)).toThrow(RangeError)
  );
});
