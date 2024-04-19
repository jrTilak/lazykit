import { describe, expect, it } from "vitest";
import timeout from ".";

describe("timeout", () => {
  it("should resolve with the result of the function if it completes within the specified time", async () => {
    const fn = () => "Hello, World!";
    const wrappedFn = timeout(fn, 1000);

    const result = await wrappedFn();

    expect(result).toBe("Hello, World!");
  });

  it("should reject with an error if the function does not complete within the specified time", async () => {
    const fn = () => new Promise((resolve) => setTimeout(resolve, 2000));
    const wrappedFn = timeout(fn, 1000);

    await expect(wrappedFn()).rejects.toThrowError("Function timed out");
  });

  it("should reject with the specified cb if provided", async () => {
    const fn = () => new Promise((resolve) => setTimeout(resolve, 2000));

    const wrappedFn = timeout(fn, 1000, () => console.log("I failed"));

    await expect(wrappedFn()).rejects.toEqual(undefined);
  });
});
