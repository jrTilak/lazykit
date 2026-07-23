import { describe, expect, it } from "bun:test";
import { pLimit } from "./pLimit";

describe("pLimit", () => {
  it("limits concurrency and preserves each task result", async () => {
    const limit = pLimit(2);
    let active = 0;
    let maximum = 0;
    const tasks = [1, 2, 3, 4].map((value) => limit(async () => {
      active += 1;
      maximum = Math.max(maximum, active);
      await new Promise((resolve) => setTimeout(resolve, 1));
      active -= 1;
      return value * 2;
    }));
    expect(await Promise.all(tasks)).toEqual([2, 4, 6, 8]);
    expect(maximum).toBe(2);
    expect(limit.activeCount).toBe(0);
    expect(limit.pendingCount).toBe(0);
  });

  it("continues after rejection and converts synchronous throws", async () => {
    const limit = pLimit(1);
    await expect(limit(() => { throw new Error("failed"); })).rejects.toThrow("failed");
    await expect(limit(() => 2)).resolves.toBe(2);
  });

  it("invokes tasks without Promise fulfillment arguments", async () => {
    const limit = pLimit(1);
    await expect(limit(function () {
      return arguments.length;
    })).resolves.toBe(0);
  });

  it("clears and rejects pending tasks without stopping active work", async () => {
    const limit = pLimit(1);
    let release = () => {};
    const active = limit(() => new Promise<number>((resolve) => { release = () => resolve(1); }));
    const pending = limit(() => 2);
    expect(limit.pendingCount).toBe(1);
    limit.clearQueue(new Error("cancelled"));
    await expect(pending).rejects.toThrow("cancelled");
    release();
    await expect(active).resolves.toBe(1);
  });

  it("validates concurrency", () => {
    expect(() => pLimit(0)).toThrow(RangeError);
    expect(() => pLimit(1.5)).toThrow(RangeError);
  });
});
