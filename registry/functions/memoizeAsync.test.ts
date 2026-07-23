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

  it("forwards and includes the receiver in the cache key", async () => {
    let calls = 0;
    const read = memoizeAsync(function (
      this: { value: number },
      offset: number
    ) {
      calls += 1;
      return this.value + offset;
    });
    const first = { value: 1 };
    const second = { value: 10 };

    await expect(read.call(first, 2)).resolves.toBe(3);
    await expect(read.call(first, 2)).resolves.toBe(3);
    await expect(read.call(second, 2)).resolves.toBe(12);
    expect(calls).toBe(2);
  });

  it("preserves and delegates callable-object properties", async () => {
    const source = Object.assign(
      async (value: number) => value,
      { label: "identity" }
    );
    const wrapped = memoizeAsync(source);

    expect(wrapped.label).toBe("identity");
    source.label = "updated";
    expect(wrapped.label).toBe("updated");
    await expect(wrapped(1)).resolves.toBe(1);
  });

  it("rejects a callable whose properties collide with memoize controls", () => {
    const source = Object.assign(async () => 1, { clear: () => undefined });
    expect(() => memoizeAsync(source)).toThrow(
      'fn must not define a "clear" property'
    );
  });
});
