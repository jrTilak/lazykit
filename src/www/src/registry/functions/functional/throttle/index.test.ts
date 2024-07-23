import { describe, it, expect, vi } from "vitest";
import throttle from ".";

describe("throttle", () => {
  it("should call the function immediately if called the first time", () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 2000);

    throttledFn("test");
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("test");
  });

  it("should not call the function again within the limit", () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 2000);

    throttledFn("test1");
    throttledFn("test2");
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("test1");
  });

  it("should call the function again after the limit", async () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 2000);

    throttledFn("test1");
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("test1");

    await new Promise((resolve) => setTimeout(resolve, 2100));

    throttledFn("test2");
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith("test2");
  });

  it("should call the function at most once within the limit", async () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 2000);

    throttledFn("test1");
    setTimeout(() => throttledFn("test2"), 500);
    setTimeout(() => throttledFn("test3"), 1500);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("test1");
  });
});
