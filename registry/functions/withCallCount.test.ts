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
    expect(() => tracked()).toThrow("failed");
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

  it("forwards the invocation receiver", () => {
    const tracked = withCallCount(function (
      this: { value: number },
      amount: number
    ) {
      return this.value + amount;
    });

    expect(tracked.call({ value: 2 }, 3)).toBe(5);
    expect(tracked.getCallCount()).toBe(1);
  });

  it("preserves and delegates callable-object properties", () => {
    const source = Object.assign((value: number) => value, {
      label: "identity",
    });
    const tracked = withCallCount(source);

    expect(tracked.label).toBe("identity");
    source.label = "updated";
    expect(tracked.label).toBe("updated");
  });

  it("rejects callable properties that collide with count controls", () => {
    const source = Object.assign(() => 1, {
      getCallCount: () => 99,
    });
    expect(() => withCallCount(source)).toThrow(
      'fn must not define "getCallCount" or "resetCallCount" properties'
    );
  });
});
