import { describe, it, expect } from "vitest";
import tryCatchAsync from ".";

// Test cases
describe("tryCatchAsync", () => {
  // Test successful async execution
  it("should return [undefined, result] when async function resolves", async () => {
    const asyncFn = async () => "Success";
    const [error, result] = await tryCatchAsync(asyncFn);
    expect(error).toBeUndefined();
    expect(result).toBe("Success");
  });

  // Test async function that rejects
  it("should return [error, undefined] when async function rejects", async () => {
    const asyncFn = async () => {
      throw new Error("Something went wrong!");
    };
    const [error, result] = await tryCatchAsync(asyncFn);
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe("Something went wrong!");
    expect(result).toBeUndefined();
  });

  // Test with a custom error type
  it("should handle different async error types", async () => {
    class CustomError extends Error {}

    const asyncFn = async () => {
      throw new CustomError("Custom async error occurred!");
    };

    const [error] = await tryCatchAsync(asyncFn);
    expect(error).toBeInstanceOf(CustomError);
    expect(error?.message).toBe("Custom async error occurred!");
  });

  // Test with an async function returning undefined
  it("should return [undefined, undefined] when async function resolves to undefined", async () => {
    const asyncFn = async () => undefined;
    const [error, result] = await tryCatchAsync(asyncFn);
    expect(error).toBeUndefined();
    expect(result).toBeUndefined();
  });

  // Test with an async function returning a number
  it("should handle async functions returning different types", async () => {
    const asyncFn = async () => 42;
    const [error, result] = await tryCatchAsync(asyncFn);
    expect(error).toBeUndefined();
    expect(result).toBe(42);
  });
});
