import { describe, expect, it } from "bun:test";
import { titleCase } from "./titleCase";

describe("titleCase", () => {
  it("handles separators, camel case, and acronyms", () => {
    expect(titleCase("HTTPServer_response-value")).toBe("Http Server Response Value");
  });

  it("normalizes existing case and supports Unicode", () => {
    expect(titleCase("hELLO déjà VU")).toBe("Hello Déjà Vu");
    expect(titleCase("---")).toBe("");
  });
});
