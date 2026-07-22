import { describe, expect, it } from "bun:test";
import { withCallCount } from "./withCallCount";

describe("withCallCount", () => {
  it("forwards arguments and returns the wrapped result", () => {
    const add = withCallCount((left: number, right: number) => left + right);
    expect(add(2, 3)).toBe(5);
  });

  it("starts at zero and counts every invocation", () => {
    const tracked = withCallCount(() => undefined);
    expect(tracked.getCallCount()).toBe(0);
    tracked();
    tracked();
    expect(tracked.getCallCount()).toBe(2);
  });

  it("counts calls that throw", () => {
    const tracked = withCallCount(() => {
      throw new Error("failed");
    });
    expect(tracked).toThrow("failed");
    expect(tracked.getCallCount()).toBe(1);
  });

  it("resets the count without changing the wrapped function", () => {
    const tracked = withCallCount((value: string) => value.toUpperCase());
    tracked("a");
    tracked.resetCallCount();
    expect(tracked.getCallCount()).toBe(0);
    expect(tracked("b")).toBe("B");
    expect(tracked.getCallCount()).toBe(1);
  });

  it("keeps counts isolated between wrappers", () => {
    const first = withCallCount(() => undefined);
    const second = withCallCount(() => undefined);
    first();
    expect(first.getCallCount()).toBe(1);
    expect(second.getCallCount()).toBe(0);
  });
});
