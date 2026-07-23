import { describe, expect, it } from "bun:test";
import { mapConcurrent } from "./mapConcurrent";

describe("mapConcurrent", () => {
  it("limits concurrency while preserving result order", async () => {
    let active = 0;
    let maximum = 0;
    const result = await mapConcurrent([3, 1, 2], 2, async (value) => {
      active += 1;
      maximum = Math.max(maximum, active);
      await new Promise((resolve) => setTimeout(resolve, value));
      active -= 1;
      return value * 2;
    });
    expect(result).toEqual([6, 2, 4]);
    expect(maximum).toBe(2);
  });

  it("passes callback context and handles empty input", async () => {
    const input = ["a"] as const;
    const calls: unknown[][] = [];
    await mapConcurrent(input, 3, (...args) => { calls.push(args as unknown[]); return args[0]; });
    expect(calls).toEqual([["a", 0, input]]);
    expect(await mapConcurrent([], 2, String)).toEqual([]);
  });

  it("skips empty slots while preserving original callback indexes", async () => {
    const sparse = Array<number>(4);
    sparse[1] = 2;
    sparse[3] = 4;
    const indexes: number[] = [];
    const leadingSlots: boolean[] = [];

    const result = await mapConcurrent(sparse, 2, (value, index, array) => {
      indexes.push(index);
      leadingSlots.push(Object.hasOwn(array, 0));
      return value * 2;
    });

    expect(result).toEqual([4, 8]);
    expect(indexes.sort()).toEqual([1, 3]);
    expect(leadingSlots).toEqual([false, false]);
  });

  it("rejects immediately, stops scheduling, and safely leaves in-flight callbacks running", async () => {
    const failure = new Error("failed");
    const started: number[] = [];
    const timeout = Symbol("timeout");

    const result = mapConcurrent([0, 1, 2, 3], 2, async (value) => {
      started.push(value);
      if (value === 0) throw failure;
      if (value === 1) await new Promise<never>(() => {});
      return value;
    });

    const outcome = await Promise.race([
      result.catch((error) => error),
      new Promise<typeof timeout>((resolve) => setTimeout(() => resolve(timeout), 25))
    ]);
    expect(outcome).toBe(failure);
    expect(started).toEqual([0, 1]);
  });

  it("keeps the first observed error when multiple in-flight callbacks fail", async () => {
    const first = new Error("first");
    const second = new Error("second");
    let rejectSecond: ((reason: unknown) => void) | undefined;

    const result = mapConcurrent([0, 1, 2], 2, async (value) => {
      if (value === 0) throw first;
      await new Promise<never>((_, reject) => {
        rejectSecond = reject;
      });
      return value;
    });

    await Promise.resolve();
    rejectSecond?.(second);
    await expect(result).rejects.toBe(first);
  });

  it("forwards synchronous errors and validates concurrency", async () => {
    const failure = new Error("failed");
    await expect(mapConcurrent([1], 1, () => { throw failure; })).rejects.toBe(failure);

    for (const concurrency of [0, -1, 1.5, Number.NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      await expect(mapConcurrent([], concurrency, String)).rejects.toThrow(
        "concurrency must be a positive safe integer"
      );
    }
  });
});
