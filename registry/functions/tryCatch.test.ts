import { describe, expect, it, vi } from "bun:test";
import { tryCatch } from "./tryCatch";

describe("tryCatch", () => {
  it("returns a synchronous success tuple", () => {
    const [error, value] = tryCatch(() => 42);
    expect(error).toBeUndefined();
    expect(value).toBe(42);
  });

  it.each([undefined, null, false, 0, ""])(
    "preserves synchronous falsy value %p",
    (expected) => {
      expect(tryCatch(() => expected)).toEqual([undefined, expected]);
    }
  );

  it("returns the original Error from synchronous failures", () => {
    const failure = new TypeError("invalid value");
    const [error, value] = tryCatch(() => {
      throw failure;
    });
    expect(error).toBe(failure);
    expect(value).toBeUndefined();
  });

  it("normalizes non-Error thrown values and preserves their cause", () => {
    const [error, value] = tryCatch(() => {
      throw "failed";
    });
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe("Operation failed");
    expect(error?.cause).toBe("failed");
    expect(value).toBeUndefined();
  });

  it("returns a promise of the same tuple for asynchronous success", async () => {
    const result = tryCatch(async () => 42);
    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toEqual([undefined, 42]);
  });

  it("returns the original Error from asynchronous failures", async () => {
    const failure = new Error("request failed");
    await expect(tryCatch(() => Promise.reject(failure))).resolves.toEqual([
      failure,
      undefined,
    ]);
  });

  it("normalizes non-Error promise rejection reasons", async () => {
    const [error, value] = await tryCatch(() => Promise.reject("failed"));
    expect(error).toBeInstanceOf(Error);
    expect(error?.cause).toBe("failed");
    expect(value).toBeUndefined();
  });

  it("supports generic thenables", async () => {
    const thenable = {
      then(resolve: (value: string) => unknown) {
        resolve("done");
      },
    } as unknown as PromiseLike<string>;
    await expect(tryCatch(() => thenable)).resolves.toEqual([
      undefined,
      "done",
    ]);
  });

  it("invokes synchronous and asynchronous operations exactly once", async () => {
    const syncOperation = vi.fn(() => "sync");
    const asyncOperation = vi.fn(async () => "async");
    tryCatch(syncOperation);
    await tryCatch(asyncOperation);
    expect(syncOperation).toHaveBeenCalledTimes(1);
    expect(asyncOperation).toHaveBeenCalledTimes(1);
  });
});
