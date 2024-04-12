import { describe, expect, it } from "vitest";
import search from "./index";

describe("search", () => {
  it("should return an empty array if no keys are provided", () => {
    const array = [
      { name: "John", age: 25 },
      { name: "Jane", age: 30 },
    ];
    const queryString = "John";
    const keys: string[] = [];

    const result = search(array, queryString, keys);

    expect(result).toEqual([]);
  });

  it("should return the original array if the query string is empty", () => {
    const array = [
      { name: "John", age: 25 },
      { name: "Jane", age: 30 },
    ];
    const queryString = "";
    const keys = ["name"];

    const result = search(array, queryString, keys);

    expect(result).toEqual(array);
  });

  it("should return the filtered array of objects matching the query", () => {
    const array = [
      { name: "John", age: 25 },
      { name: "Jane", age: 30 },
      { name: "John Doe", age: 35 },
    ];
    const queryString = "John";
    const keys = ["name"];

    const result = search(array, queryString, keys);

    expect(result).toEqual([
      { name: "John", age: 25 },
      { name: "John Doe", age: 35 },
    ]);
  });

  it("should return an empty array if none of the keys contain the query string", () => {
    const array = [
      { name: "John", age: 25 },
      { name: "Jane", age: 30 },
    ];
    const queryString = "Doe";
    const keys = ["name"];

    const result = search(array, queryString, keys);

    expect(result).toEqual([]);
  });

  it("should return an empty array if the keys does not exist in the object", () => {
    const array = [
      { name: "John", age: 25 },
      { name: "Jane", age: 30 },
    ];
    const queryString = "John";
    const keys = ["email"];

    const result = search(array, queryString, keys);

    expect(result).toEqual([]);
  });
});
