import { describe, expect, it, vi } from "bun:test";
import { retry } from "./retry";

describe("retry", () => {
  it("returns immediately when the first attempt succeeds", async () => {
    const operation = vi.fn(() => "success");
    await expect(retry(operation)).resolves.toBe("success");
    expect(operation).toHaveBeenCalledWith(1);
  });

  it("retries failures and exposes the one-based attempt number", async () => {
    const attempts: number[] = [];
    const result = await retry(
      async (attempt) => {
        attempts.push(attempt);
        if (attempt < 3) throw new Error(`failure ${attempt}`);
        return "done";
      },
      { maxAttempts: 3 }
    );
    expect(result).toBe("done");
    expect(attempts).toEqual([1, 2, 3]);
  });

  it("throws the final error after reaching maxAttempts", async () => {
    const errors = [new Error("first"), new Error("last")];
    const operation = vi.fn((attempt: number) => Promise.reject(errors[attempt - 1]));
    await expect(retry(operation, { maxAttempts: 2 })).rejects.toBe(errors[1]);
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("does not retry when shouldRetry returns false", async () => {
    const error = new Error("stop");
    const operation = vi.fn(() => Promise.reject(error));
    const shouldRetry = vi.fn(() => false);
    await expect(
      retry(operation, { maxAttempts: 3, shouldRetry })
    ).rejects.toBe(error);
    expect(operation).toHaveBeenCalledTimes(1);
    expect(shouldRetry).toHaveBeenCalledWith(error, 1);
  });

  it("supports asynchronous shouldRetry decisions", async () => {
    let callCount = 0;
    const operation = vi.fn(async () => {
      callCount += 1;
      if (callCount === 1) throw new Error("temporary");
      return "done";
    });
    await expect(
      retry(operation, { maxAttempts: 2, shouldRetry: async () => true })
    ).resolves.toBe("done");
  });

  it("waits for delayMs between attempts", async () => {
    let callCount = 0;
    const operation = vi.fn(async () => {
      callCount += 1;
      if (callCount === 1) throw new Error("temporary");
      return "done";
    });
    const promise = retry(operation, { maxAttempts: 2, delayMs: 15 });
    await Bun.sleep(5);
    expect(operation).toHaveBeenCalledTimes(1);
    await expect(promise).resolves.toBe("done");
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it.each([0, -1, 1.5, Number.POSITIVE_INFINITY])(
    "rejects invalid maxAttempts %p",
    async (maxAttempts) => {
      await expect(retry(() => true, { maxAttempts })).rejects.toThrow(RangeError);
    }
  );

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid delayMs %p",
    async (delayMs) => {
      await expect(retry(() => true, { delayMs })).rejects.toThrow(RangeError);
    }
  );

  it("runs exactly once when maxAttempts is one", async () => {
    const operation = vi.fn(() => Promise.reject(new Error("failed")));
    await expect(retry(operation, { maxAttempts: 1 })).rejects.toThrow("failed");
    expect(operation).toHaveBeenCalledTimes(1);
  });
});
