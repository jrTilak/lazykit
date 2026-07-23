import { describe, expect, it } from "bun:test";
import { createEventEmitter } from "./createEventEmitter";

type Events = { message: string; count: number };

describe("createEventEmitter", () => {
  it("subscribes, emits synchronously, and unsubscribes", () => {
    const emitter = createEventEmitter<Events>();
    const values: string[] = [];
    const unsubscribe = emitter.on("message", (value) => values.push(value));
    emitter.emit("message", "first");
    unsubscribe();
    emitter.emit("message", "second");
    expect(values).toEqual(["first"]);
  });

  it("supports once listeners and stable emission snapshots", () => {
    const emitter = createEventEmitter<Events>();
    let calls = 0;
    emitter.once("count", () => { calls += 1; });
    let unsubscribe = () => {};
    emitter.on("count", () => unsubscribe());
    unsubscribe = emitter.on("count", () => { calls += 10; });
    emitter.emit("count", 1);
    emitter.emit("count", 2);
    expect(calls).toBe(11);
  });

  it("reports counts and clears one or every event", () => {
    const emitter = createEventEmitter<Events>();
    emitter.on("message", () => {});
    emitter.on("count", () => {});
    expect(emitter.listenerCount("message")).toBe(1);
    emitter.clear("message");
    expect(emitter.listenerCount("message")).toBe(0);
    emitter.clear();
    expect(emitter.listenerCount("count")).toBe(0);
  });
});
