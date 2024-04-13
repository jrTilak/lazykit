import { describe, expect, it } from "vitest";
import insert from ".";

describe("insert", () => {
  it("should insert items at the specified index", () => {
    const arr = [1, 2, 3];
    const index = 1;
    const items = [4, 5];

    const result = insert(arr, index, items, false);

    expect(result).toEqual([1, 4, 5, 2, 3]);
  });

  it("should handle empty arrays", () => {
    const arr: number[] = [];
    const index = 0;
    const items = [4, 5];

    const result = insert(arr, index, items, false);

    expect(result).toEqual([4, 5]);
  });

  it("should insert items at the specified index recursively when recursive is true", () => {
    const arr = [1, 2, 3];
    const index = 1;
    const items = [4, 5];

    const result = insert(arr, index, items, true);

    expect(result).toEqual([1, 4, 5, 2, 4, 5, 3, 4, 5]);
  });

  it("should insert items at the specified index recursively when recursive is true", () => {
    const arr = [1, 2, 3, 4, 5];
    const index = 2;
    const items = [6, 7];
    const result = insert(arr, index, items, true);

    expect(result).toEqual([1, 2, 6, 7, 3, 4, 6, 7, 5]);
  });

  //negative index
  it("should insert items at the specified index", () => {
    const arr = [1, 2, 3];
    const index = -1;
    const items = [4, 5];

    const result = insert(arr, index, items, false);

    expect(result).toEqual([1, 2, 4, 5, 3]);
  });

  it("should handle empty arrays", () => {
    const arr: number[] = [];
    const index = -0;
    const items = [4, 5];

    const result = insert(arr, index, items, false);

    expect(result).toEqual([4, 5]);
  });

  it("should insert items at the specified index recursively when recursive is true", () => {
    const arr = [1, 2, 3];
    const index = -1;
    const items = [4, 5];

    const result = insert(arr, index, items, true);

    expect(result).toEqual([4, 5, 1, 4, 5, 2, 4, 5, 3]);
  });

  it("should insert items at the specified index recursively when recursive is true", () => {
    const arr = [1, 2, 3, 4, 5];
    const index = -2;
    const items = [6, 7];
    const result = insert(arr, index, items, true);

    expect(result).toEqual([1, 6, 7, 2, 3, 6, 7, 4, 5]);
  });
});
