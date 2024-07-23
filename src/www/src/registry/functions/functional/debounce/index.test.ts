import { describe, it, expect, vi } from "vitest";
import debounce from ".";
describe("debounce", () => {
  it("should call the function after the specified delay", async () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("test");
    expect(mockFn).not.toHaveBeenCalled();

    await new Promise((resolve) => setTimeout(resolve, 350));

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("test");
  });

  it("should not call the function if called again within the delay", async () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("test1");
    debouncedFn("test2");
    expect(mockFn).not.toHaveBeenCalled();

    await new Promise((resolve) => setTimeout(resolve, 350));

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("test2");
  });

  it("should reset the delay if called again within the delay", async () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("test1");

    setTimeout(() => debouncedFn("test2"), 200);
    setTimeout(() => debouncedFn("test3"), 250);

    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("test3");
  });
});
