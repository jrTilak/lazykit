import { describe, expect, it } from "bun:test";
import { snakeCase } from "./snakeCase";

describe("snakeCase", () => {
  it("handles mixed boundaries and acronyms", () => {
    expect(snakeCase("HTTPServer-response value")).toBe("http_server_response_value");
  });

  it("normalizes punctuation and supports Unicode", () => {
    expect(snakeCase("déjà...vu")).toBe("déjà_vu");
    expect(snakeCase("")).toBe("");
  });
});
