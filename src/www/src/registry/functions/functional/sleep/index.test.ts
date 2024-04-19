import { describe, expect, it } from "vitest";
import sleep from ".";

describe("sleep", () => {
  it("should pause execution for the specified number of milliseconds", async () => {
    const ms = 1000; // Change this to the desired number of milliseconds

    const startTime = Date.now();
    await sleep(ms);
    const endTime = Date.now();

    const elapsedTime = endTime - startTime;
    expect(elapsedTime).toBeGreaterThanOrEqual(ms);
  });
});
