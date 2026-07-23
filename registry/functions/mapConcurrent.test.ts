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

  it("forwards errors and validates concurrency", async () => {
    await expect(mapConcurrent([1], 1, () => { throw new Error("failed"); })).rejects.toThrow("failed");
    await expect(mapConcurrent([], 0, String)).rejects.toThrow(RangeError);
  });
});
