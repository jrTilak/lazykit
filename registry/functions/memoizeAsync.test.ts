import { describe, expect, it } from "bun:test";
import { memoizeAsync } from "./memoizeAsync";

describe("memoizeAsync", () => {
  it("shares in-flight and fulfilled promises for identical arguments", async () => {
    let calls = 0;
    const fn = memoizeAsync(async (value: number) => { calls += 1; await Promise.resolve(); return value * 2; });
    const first = fn(2);
    const second = fn(2);
    expect(first).toBe(second);
    expect(await first).toBe(4);
    expect(await fn(2)).toBe(4);
    expect(calls).toBe(1);
  });

  it("evicts rejected and synchronously thrown calls by default", async () => {
    let calls = 0;
    const fn = memoizeAsync(() => { calls += 1; if (calls < 3) throw new Error("no"); return 3; });
    await expect(fn()).rejects.toThrow("no");
    await expect(fn()).rejects.toThrow("no");
    await expect(fn()).resolves.toBe(3);
  });

  it("can cache rejection and clear all entries", async () => {
    let calls = 0;
    const fn = memoizeAsync(async () => { calls += 1; throw new Error(String(calls)); }, { cacheRejected: true });
    await expect(fn()).rejects.toThrow("1");
    await expect(fn()).rejects.toThrow("1");
    fn.clear();
    await expect(fn()).rejects.toThrow("2");
  });
});
