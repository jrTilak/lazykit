import { describe, expect, it } from "bun:test";
import { unescapeHtml } from "./unescapeHtml";

describe("unescapeHtml", () => {
  it("decodes supported named and numeric entities", () => {
    expect(unescapeHtml("&lt;a&gt;&quot;x&quot; &amp; &#39;y&#x27;")).toBe(`<a>"x" & 'y'`);
  });

  it("is case-insensitive and leaves unsupported entities untouched", () => {
    expect(unescapeHtml("&LT;&copy;")).toBe("<&copy;");
  });

  it("decodes one layer per call", () => {
    expect(unescapeHtml("&amp;lt;")).toBe("&lt;");
  });
});
