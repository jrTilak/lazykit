import { describe, expect, it } from "bun:test";
import { escapeHtml } from "./escapeHtml";

describe("escapeHtml", () => {
  it("escapes HTML text and attribute characters", () => {
    expect(escapeHtml(`<a title="Tom & Jerry's">`)).toBe("&lt;a title=&quot;Tom &amp; Jerry&#39;s&quot;&gt;");
  });

  it("escapes existing entities without double-pass corruption", () => {
    expect(escapeHtml("&amp;")).toBe("&amp;amp;");
    expect(escapeHtml("")).toBe("");
  });
});
