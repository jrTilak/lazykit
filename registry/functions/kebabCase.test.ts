import { describe, expect, it } from "bun:test";
import { kebabCase } from "./kebabCase";

describe("kebabCase", () => {
  it("handles mixed boundaries and acronyms", () => {
    expect(kebabCase("HTTPServer_response value")).toBe("http-server-response-value");
  });

  it("normalizes repeated punctuation and supports Unicode", () => {
    expect(kebabCase("  déjà---vu  ")).toBe("déjà-vu");
    expect(kebabCase("---")).toBe("");
  });
});
