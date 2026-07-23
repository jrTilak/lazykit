import { describe, expect, it } from "bun:test";
import { joinUrl } from "./joinUrl";

describe("joinUrl", () => {
  it("joins absolute and relative URLs without duplicate slashes", () => {
    expect(joinUrl("https://example.com/api/", "/users/", "42")).toBe("https://example.com/api/users/42");
    expect(joinUrl("/api/", "/users", "42")).toBe("/api/users/42");
  });

  it("preserves a base query string or hash", () => {
    expect(joinUrl("https://example.com/api?token=x", "users")).toBe("https://example.com/api/users?token=x");
    expect(joinUrl("/api#section", "users")).toBe("/api/users#section");
  });

  it("returns the base unchanged without segments and skips empty segments", () => {
    expect(joinUrl("https://example.com/")).toBe("https://example.com/");
    expect(joinUrl("https://example.com", "", "users")).toBe("https://example.com/users");
  });
});
