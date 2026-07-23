import { describe, expect, it } from "bun:test";
import { withQueryParams } from "./withQueryParams";

describe("withQueryParams", () => {
  it("adds, replaces, repeats, and removes parameters", () => {
    expect(withQueryParams("/search?q=old&remove=yes#results", { q: "new value", page: 2, tag: ["a", "b"], remove: null })).toBe("/search?q=new+value&page=2&tag=a&tag=b#results");
  });

  it("preserves absolute and protocol-relative URLs", () => {
    expect(withQueryParams("https://example.com/path", { ok: true })).toBe("https://example.com/path?ok=true");
    expect(withQueryParams("//example.com/path", { ok: true })).toBe("//example.com/path?ok=true");
  });

  it("handles URL instances, empty arrays, and undefined", () => {
    expect(withQueryParams(new URL("https://example.com/?a=1"), { a: [], b: undefined })).toBe("https://example.com/");
  });

  it("preserves path-relative and query-only input forms", () => {
    expect(withQueryParams("search?q=old", { q: "new" })).toBe("search?q=new");
    expect(withQueryParams("?q=old#top", { page: 2 })).toBe("?q=old&page=2#top");
  });
});
