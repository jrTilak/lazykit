import { describe, expect, it } from "bun:test";
import { camelCase } from "./camelCase";

describe("camelCase", () => {
  it("handles separators, existing casing, acronyms, and numbers", () => {
    expect(camelCase("hello-world_value")).toBe("helloWorldValue");
    expect(camelCase("HTTPServer2Response")).toBe("httpServer2Response");
  });

  it("supports Unicode words and empty input", () => {
    expect(camelCase("déjà vu")).toBe("déjàVu");
    expect(camelCase("---")).toBe("");
  });
});
