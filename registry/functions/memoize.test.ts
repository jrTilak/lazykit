import { describe, expect, it } from "bun:test";
import { memoize } from "./memoize";

describe("memoize", () => {
  it("keys cache entries by every argument", () => {
    let calls = 0;
    const add = memoize((a: number, b: number) => { calls += 1; return a + b; });
    expect(add(1, 2)).toBe(3);
    expect(add(1, 2)).toBe(3);
    expect(add(1, 3)).toBe(4);
    expect(calls).toBe(2);
  });

  it("supports object identity, zero arguments, and undefined results", () => {
    let calls = 0;
    const object = {};
    const fn = memoize((value?: object) => { calls += 1; return value ? undefined : calls; });
    expect(fn(object)).toBeUndefined();
    expect(fn(object)).toBeUndefined();
    expect(fn()).toBe(2);
    expect(fn()).toBe(2);
    expect(calls).toBe(2);
  });

  it("does not cache thrown calls and can clear the cache", () => {
    let calls = 0;
    const fn = memoize(() => { calls += 1; if (calls === 1) throw new Error("no"); return calls; });
    expect(() => fn()).toThrow("no");
    expect(fn()).toBe(2);
    fn.clear();
    expect(fn()).toBe(3);
  });

  it("forwards and includes the receiver in the cache key", () => {
    let calls = 0;
    const read = memoize(function (this: { value: number }, offset: number) {
      calls += 1;
      return this.value + offset;
    });
    const first = { value: 1 };
    const second = { value: 10 };

    expect(read.call(first, 2)).toBe(3);
    expect(read.call(first, 2)).toBe(3);
    expect(read.call(second, 2)).toBe(12);
    expect(calls).toBe(2);
  });

  it("preserves and delegates callable-object properties", () => {
    const source = Object.assign((value: number) => value, {
      label: "identity",
    });
    const wrapped = memoize(source);

    expect(wrapped.label).toBe("identity");
    source.label = "updated";
    expect(wrapped.label).toBe("updated");
  });

  it("rejects a callable whose properties collide with memoize controls", () => {
    const source = Object.assign(() => 1, { clear: () => undefined });
    expect(() => memoize(source)).toThrow('fn must not define a "clear" property');
  });
});
