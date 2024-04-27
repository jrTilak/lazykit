import { describe, expect, it } from "vitest";
import sampleObj from ".";

describe("sampleObj", () => {
  it("should create an object with random number values for the given keys", () => {
    const keys = ["key1", "key2", "key3"];
    const obj = sampleObj(...keys);

    expect(Object.keys(obj)).toEqual(keys);
    expect(Object.values(obj)).toEqual(
      expect.arrayContaining([expect.any(Number)])
    );
  });
});
