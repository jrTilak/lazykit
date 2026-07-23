import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { loadScript } from "./loadScript";

const settings = (window as unknown as {
  happyDOM: { settings: { handleDisabledFileLoadingAsSuccess: boolean } };
}).happyDOM.settings;

describe("loadScript", () => {
  beforeEach(() => {
    settings.handleDisabledFileLoadingAsSuccess = true;
  });

  afterEach(() => {
    settings.handleDisabledFileLoadingAsSuccess = false;
    document.querySelectorAll("script").forEach((script) => script.remove());
  });

  it("deduplicates concurrent URLs and gives the first call's attributes precedence", async () => {
    const originalAppend = document.head.append;
    let script: HTMLScriptElement | undefined;
    document.head.append = ((node: HTMLScriptElement) => {
      script = node;
    }) as typeof document.head.append;

    try {
      const first = loadScript("/assets/app.js", {
        src: "/ignored.js",
        integrity: "first",
        "data-loaded": "spoofed"
      });
      const second = loadScript("https://localhost/assets/app.js", {
        integrity: "second"
      });

      expect(second).toBe(first);
      expect(script?.src).toBe("https://localhost/assets/app.js");
      expect(script?.getAttribute("integrity")).toBe("first");

      script?.dispatchEvent(new Event("load"));
      await expect(first).resolves.toBe(script);
    } finally {
      document.head.append = originalAppend;
    }
  });

  it("returns a pre-existing script immediately without trusting public data markers", async () => {
    const script = document.createElement("script");
    script.src = "https://localhost/ready.js";
    script.integrity = "original";
    script.dataset.loaded = "false";
    script.dataset.lazykitLoadScript = "loading";
    document.head.append(script);

    const timeout = Symbol("timeout");
    const outcome = await Promise.race([
      loadScript("/ready.js", { integrity: "replacement" }),
      new Promise<typeof timeout>((resolve) => setTimeout(() => resolve(timeout), 25))
    ]);

    expect(outcome).toBe(script);
    expect(script.integrity).toBe("original");
    expect(script.dataset.loaded).toBe("false");
    expect(script.dataset.lazykitLoadScript).toBe("loading");
  });

  it("handles synchronous load events without leaving a stale pending entry", async () => {
    const originalAppend = document.head.append;
    const scripts: HTMLScriptElement[] = [];
    document.head.append = ((node: HTMLScriptElement) => {
      scripts.push(node);
      node.dispatchEvent(new Event("load"));
    }) as typeof document.head.append;

    try {
      const first = loadScript("/synchronous.js");
      await expect(first).resolves.toBe(scripts[0]);

      const second = loadScript("/synchronous.js");
      expect(second).not.toBe(first);
      await expect(second).resolves.toBe(scripts[1]);
      expect(scripts).toHaveLength(2);
    } finally {
      document.head.append = originalAppend;
    }
  });

  it("handles synchronous errors and retries with a fresh element", async () => {
    const originalAppend = document.head.append;
    const scripts: HTMLScriptElement[] = [];
    document.head.append = ((node: HTMLScriptElement) => {
      scripts.push(node);
      node.dispatchEvent(new Event(scripts.length === 1 ? "error" : "load"));
    }) as typeof document.head.append;

    try {
      const first = loadScript("/failed.js");
      await expect(first).rejects.toThrow("Failed to load script: https://localhost/failed.js");
      expect(scripts[0]?.isConnected).toBe(false);

      const retry = loadScript("/failed.js");
      await expect(retry).resolves.toBe(scripts[1]);
      expect(scripts).toHaveLength(2);
    } finally {
      document.head.append = originalAppend;
    }
  });

  it("turns synchronous insertion failures into retryable promise rejections", async () => {
    const originalAppend = document.head.append;
    let attempts = 0;
    document.head.append = ((node: HTMLScriptElement) => {
      attempts += 1;
      if (attempts === 1) throw new Error("insertion failed");
      node.dispatchEvent(new Event("load"));
    }) as typeof document.head.append;

    try {
      await expect(loadScript("/insert.js")).rejects.toThrow(
        "Failed to load script: https://localhost/insert.js"
      );
      await expect(loadScript("/insert.js")).resolves.toBeInstanceOf(HTMLScriptElement);
      expect(attempts).toBe(2);
    } finally {
      document.head.append = originalAppend;
    }
  });

  it("rejects setup errors through its promise and remains retryable", async () => {
    await expect(loadScript("")).rejects.toThrow("source must not be empty");
    await expect(loadScript(" \n\t ")).rejects.toThrow(
      "source must not be empty"
    );
    await expect(loadScript("http://[invalid")).rejects.toBeInstanceOf(
      TypeError
    );
    await expect(
      loadScript("/attributes.js", { "invalid name": "value" })
    ).rejects.toThrow();
    await expect(loadScript("/attributes.js")).resolves.toBeInstanceOf(
      HTMLScriptElement
    );
  });
});
