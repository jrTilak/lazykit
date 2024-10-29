import { describe, it, expect } from "vitest";
import tryCatch from ".";

// Test function
describe("tryCatch", () => {
  // Test successful execution
  it("should return [undefined, result] when function executes without error", () => {
    const [error, result] = tryCatch(() => "Success");
    expect(error).toBeUndefined();
    expect(result).toBe("Success");
  });

  // Test error handling
  it("should return [error, undefined] when function throws an error", () => {
    const [error, result] = tryCatch(() => {
      throw new Error("Something went wrong!");
    });
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe("Something went wrong!");
    expect(result).toBeUndefined();
  });

  // Test with different error types
  it("should handle different error types", () => {
    class CustomError extends Error {}

    const [customError] = tryCatch(() => {
      throw new CustomError("Custom error occurred!");
    });

    expect(customError).toBeInstanceOf(CustomError);
    expect(customError?.message).toBe("Custom error occurred!");
  });

  // Test with a function that returns undefined
  it("should return [undefined, undefined] when function returns undefined", () => {
    const [error, result] = tryCatch(() => undefined);
    expect(error).toBeUndefined();
    expect(result).toBeUndefined();
  });

  // Test with synchronous function returning a number
  it("should handle synchronous functions returning different types", () => {
    const [error, result] = tryCatch(() => 42);
    expect(error).toBeUndefined();
    expect(result).toBe(42);
  });
});
