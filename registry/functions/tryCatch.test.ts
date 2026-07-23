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

  it("reads a thenable getter once and calls the captured method with its receiver", async () => {
    let reads = 0;
    let receiverWasCorrect = false;
    const thenable = {
      get then() {
        reads += 1;
        if (reads > 1) throw new Error("then was read twice");
        return function (
          this: unknown,
          resolve: (value: string) => unknown
        ) {
          receiverWasCorrect = this === thenable;
          resolve("done");
        };
      },
    } as PromiseLike<string>;

    await expect(tryCatch(() => thenable)).resolves.toEqual([
      undefined,
      "done",
    ]);
    expect(reads).toBe(1);
    expect(receiverWasCorrect).toBe(true);
  });

  it("normalizes errors thrown while reading or calling then", async () => {
    const getterError = new Error("getter failed");
    const throwingGetter = Object.defineProperty({}, "then", {
      get() {
        throw getterError;
      },
    }) as PromiseLike<never>;
    await expect(tryCatch(() => throwingGetter)).resolves.toEqual([
      getterError,
      undefined,
    ]);

    const callError = new Error("call failed");
    const throwingCall = {
      then() {
        throw callError;
      },
    } as unknown as PromiseLike<never>;
    await expect(tryCatch(() => throwingCall)).resolves.toEqual([
      callError,
      undefined,
    ]);
  });

  it("keeps hidden thenability safe for statically plain objects", async () => {
    const getterError = new Error("hidden getter failed");
    const object = Object.defineProperty({ value: 1 }, "then", {
      get() {
        throw getterError;
      },
    });

    const result = tryCatch(() => object);
    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toEqual([getterError, undefined]);
  });

  it("keeps values hidden by a void return annotation safe", async () => {
    const operation: () => void = () => Promise.resolve(42);
    const result = tryCatch(operation);

    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toEqual([undefined, 42]);
  });

  it("keeps thenability safe behind the broad non-nullish type", async () => {
    const operation: () => {} = () => Promise.resolve(42);
    const result = tryCatch(operation);

    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toEqual([undefined, 42]);
  });

  it("accepts only the first thenable settlement", async () => {
    const thenable = {
      then(
        resolve: (value: string) => unknown,
        reject: (reason: unknown) => unknown
      ) {
        resolve("first");
        resolve("second");
        reject(new Error("late"));
      },
    } as PromiseLike<string>;

    await expect(tryCatch(() => thenable)).resolves.toEqual([
      undefined,
      "first",
    ]);
  });

  it("turns thenable self-resolution into a TypeError result", async () => {
    const thenable = {
      then(resolve: (value: unknown) => unknown) {
        resolve(thenable);
      },
    } as PromiseLike<never>;

    const [error, value] = await tryCatch(() => thenable);
    expect(error).toBeInstanceOf(TypeError);
    expect(value).toBeUndefined();
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
