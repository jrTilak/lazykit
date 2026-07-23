import { afterEach, describe, expect, it } from "bun:test";
import { loadScript } from "./loadScript";

describe("loadScript", () => {
  const settings = (window as unknown as {
    happyDOM: { settings: { handleDisabledFileLoadingAsSuccess: boolean } };
  }).happyDOM.settings;

  afterEach(() => {
    settings.handleDisabledFileLoadingAsSuccess = false;
    document.querySelectorAll("script").forEach((script) => script.remove());
  });

  it("shares concurrent requests and resolves the loaded element", async () => {
    const originalAppend = document.head.append;
    let script: HTMLScriptElement | undefined;
    document.head.append = ((node: HTMLScriptElement) => { script = node; }) as typeof document.head.append;
    try {
      const first = loadScript("/assets/app.js", { integrity: "test" });
      const second = loadScript("/assets/app.js");
      expect(first).toBe(second);
      expect(script?.getAttribute("integrity")).toBe("test");
      script?.dispatchEvent(new Event("load"));
      expect(await first).toBe(script);
      expect(script?.dataset.loaded).toBe("true");
    } finally {
      document.head.append = originalAppend;
    }
  });

  it("returns an already loaded script", async () => {
    settings.handleDisabledFileLoadingAsSuccess = true;
    const script = document.createElement("script");
    script.src = "https://localhost/ready.js";
    script.dataset.loaded = "true";
    document.head.append(script);
    await expect(loadScript("/ready.js")).resolves.toBe(script);
  });

  it("rejects failures and allows retrying", async () => {
    const originalAppend = document.head.append;
    let script: HTMLScriptElement | undefined;
    document.head.append = ((node: HTMLScriptElement) => { script = node; }) as typeof document.head.append;
    try {
      const first = loadScript("/failed.js");
      script?.dispatchEvent(new Event("error"));
      await expect(first).rejects.toThrow("Failed to load script");

      const retry = loadScript("/failed.js");
      const retriedScript = script;
      retriedScript?.dispatchEvent(new Event("load"));
      await expect(retry).resolves.toBe(retriedScript);
    } finally {
      document.head.append = originalAppend;
    }
  });
});
