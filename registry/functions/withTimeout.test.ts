import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";
import { withTimeout } from "./withTimeout";

describe("withTimeout", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("resolves synchronous values and forwards arguments", async () => {
    const wrapped = withTimeout((a: number, b: number) => a + b, 100);
    await expect(wrapped(2, 3)).resolves.toBe(5);
  });

  it("resolves an asynchronous result before its deadline", async () => {
    const wrapped = withTimeout(
      () => new Promise<string>((resolve) => setTimeout(() => resolve("done"), 50)),
      100
    );
    const promise = wrapped();
    await Promise.resolve();
    vi.advanceTimersByTime(50);
    await expect(promise).resolves.toBe("done");
  });

  it("preserves synchronous thrown errors", async () => {
    const error = new Error("operation failed");
    const wrapped = withTimeout(() => {
      throw error;
    }, 100);
    await expect(wrapped()).rejects.toBe(error);
  });

  it("preserves asynchronous rejection reasons", async () => {
    const error = new Error("operation failed");
    const wrapped = withTimeout(() => Promise.reject(error), 100);
    await expect(wrapped()).rejects.toBe(error);
  });

  it("rejects pending work with the default timeout error", async () => {
    const wrapped = withTimeout(() => new Promise(() => undefined), 100);
    const promise = wrapped();
    await Promise.resolve();
    vi.advanceTimersByTime(100);
    await expect(promise).rejects.toThrow("Operation timed out after 100ms");
  });

  it("creates a custom error with invocation arguments", async () => {
    const createError = vi.fn((id: string) => new Error(`Timed out: ${id}`));
    const wrapped = withTimeout(
      (_id: string) => new Promise(() => undefined),
      10,
      createError
    );
    const promise = wrapped("job-1");
    await Promise.resolve();
    vi.advanceTimersByTime(10);
    await expect(promise).rejects.toThrow("Timed out: job-1");
    expect(createError).toHaveBeenCalledWith("job-1");
  });

  it("rejects with errors thrown by the error factory", async () => {
    const factoryError = new Error("factory failed");
    const wrapped = withTimeout(
      () => new Promise(() => undefined),
      10,
      () => {
        throw factoryError;
      }
    );
    const promise = wrapped();
    await Promise.resolve();
    vi.advanceTimersByTime(10);
    await expect(promise).rejects.toBe(factoryError);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid timeout %p",
    (timeoutMs) =>
      expect(() => withTimeout(() => true, timeoutMs)).toThrow(RangeError)
  );
});
