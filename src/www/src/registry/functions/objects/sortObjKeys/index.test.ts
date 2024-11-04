import { describe, expect, it } from "vitest";
import sortObjKeys from ".";
describe("sortObjKeys in ascending order", () => {
  it("should sort the keys of an object in ascending order", () => {
    const obj = { c: 1, a: 2, b: 3 };
    const sortedObj = sortObjKeys(obj, true);
    expect(Object.keys(sortedObj)).toEqual(["a", "b", "c"]);
  });
});

describe("sortObjKeys in descending order", () => {
  it("should sort the keys of an object in descending order", () => {
    const obj = { c: 1, a: 2, b: 3 };
    const sortedObj = sortObjKeys(obj, false);
    expect(Object.keys(sortedObj)).toEqual(["c", "b", "a"]);
  });
});
