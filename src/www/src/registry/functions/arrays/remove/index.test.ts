import { describe, expect, it } from "vitest";
import remove from ".";

describe("remove", () => {
  it("should remove element at the specified index", () => {
    const array = [1, 2, 3, 4, 5];
    const index = 2;
    const expected = [1, 2, 4, 5];
    const result = remove(array, index);
    expect(result).toEqual(expected);
  });

  it("should remove elements at the specified indices", () => {
    const array = [1, 2, 3, 4, 5];
    const indices = [1, 3];
    const expected = [1, 3, 5];
    const result = remove(array, indices);
    expect(result).toEqual(expected);
  });

  // for negative indices
  it("should remove element at the specified negative index", () => {
    const array = [1, 2, 3, 4, 5];
    const index = -2;
    const expected = [1, 2, 3, 5];
    const result = remove(array, index);
    expect(result).toEqual(expected);
  });

  it("should remove elements at the specified negative indices", () => {
    const array = [1, 2, 3, 4, 5];
    const indices = [-1, -3];
    const expected = [1, 2, 4];
    const result = remove(array, indices);
    expect(result).toEqual(expected);
  });

  // mixed indices

  it("should remove elements at the specified mixed indices", () => {
    const array = [1, 2, 3, 4, 5];
    const indices = [1, -3];
    const expected = [1, 4, 5];
    const result = remove(array, indices);
    expect(result).toEqual(expected);
  });
});
