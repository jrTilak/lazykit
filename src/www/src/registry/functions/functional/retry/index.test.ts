import { describe, expect, it, vi } from "vitest";
import retry from ".";

describe("retry", () => {
  it("should resolve with the result if the function succeeds", async () => {
    const mockFn = vi.fn(() => "success");
    const result = await retry(mockFn);
    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should reject with the last error if all retries fail", async () => {
    const mockFn = vi.fn(() => Promise.reject(new Error("failed")));
    await expect(retry(mockFn, 2, 1000)).rejects.toThrow("failed");
    expect(mockFn).toHaveBeenCalledTimes(3);
  });
});
