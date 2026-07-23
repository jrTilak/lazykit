import { describe, expect, it } from "bun:test";
import { pascalCase } from "./pascalCase";

describe("pascalCase", () => {
  it("handles separators, existing casing, acronyms, and numbers", () => {
    expect(pascalCase("hello-world_value")).toBe("HelloWorldValue");
    expect(pascalCase("HTTPServer2Response")).toBe("HttpServer2Response");
  });

  it("supports Unicode and empty input", () => {
    expect(pascalCase("élan vital")).toBe("ÉlanVital");
    expect(pascalCase("")).toBe("");
  });
});
