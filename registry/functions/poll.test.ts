import { describe, expect, it } from "bun:test";
import { poll } from "./poll";

describe("poll", () => {
  it("polls until synchronous or asynchronous conditions pass", async () => {
    const attempts: number[] = [];
    const result = await poll((attempt) => { attempts.push(attempt); return attempt * 2; }, { until: async (value) => value >= 6, intervalMs: 0 });
    expect(result).toBe(6);
    expect(attempts).toEqual([1, 2, 3]);
  });

  it("supports computed intervals", async () => {
    const intervals: number[] = [];
    await poll((attempt) => attempt, { until: (value) => value === 2, intervalMs: (attempt) => { intervals.push(attempt); return 0; } });
    expect(intervals).toEqual([1]);
  });

  it("throws after the attempt limit and validates options", async () => {
    await expect(poll(() => false, { until: Boolean, maxAttempts: 2 })).rejects.toThrow("2 attempts");
    await expect(poll(() => false, { until: Boolean, maxAttempts: 0 })).rejects.toThrow(RangeError);
    await expect(poll(() => false, { until: Boolean, maxAttempts: 2, intervalMs: -1 })).rejects.toThrow(RangeError);
  });

  it("honors an AbortSignal before and during waiting", async () => {
    const first = new AbortController();
    first.abort(new Error("stopped"));
    await expect(poll(() => 1, { until: () => false, signal: first.signal })).rejects.toThrow("stopped");

    const second = new AbortController();
    const result = poll(() => 1, { until: () => false, intervalMs: 100, signal: second.signal });
    queueMicrotask(() => second.abort(new Error("later")));
    await expect(result).rejects.toThrow("later");
  });

  it("does not evaluate the condition after an operation aborts", async () => {
    const controller = new AbortController();
    let conditionCalls = 0;
    const result = poll(
      () => {
        controller.abort(new Error("during operation"));
        return 1;
      },
      {
        until: () => {
          conditionCalls += 1;
          return true;
        },
        signal: controller.signal,
      }
    );

    await expect(result).rejects.toThrow("during operation");
    expect(conditionCalls).toBe(0);
  });
});
