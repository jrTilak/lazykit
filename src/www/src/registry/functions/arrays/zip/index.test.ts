// FILEPATH: /C:/Users/sagar/OneDrive/Desktop/lazykit/src/www/src/registry/functions/arrays/zip/index.test.ts

import { describe, expect, it } from "vitest";
import zip from ".";

describe("zip", () => {
  it("should zip elements from arrays correctly in non-strict mode", () => {
    const arr = [
      [1, 2, 3],
      ["a", "b"],
    ];
    const result = zip({ arr });

    expect(result).toEqual([
      [1, "a"],
      [2, "b"],
      [3, undefined],
    ]);
  });

  it("should zip elements from arrays correctly in strict mode", () => {
    const arr = [
      [1, 2, 3],
      ["a", "b"],
    ];
    const result = zip({ arr, strict: true });

    expect(result).toEqual([
      [1, "a"],
      [2, "b"],
    ]);
  });

  it("should return an empty array when input is an empty array", () => {
    const arr: any[] = [];
    const result = zip({ arr });

    expect(result).toEqual([]);
  });
});
