const pending = new Map<string, Promise<HTMLScriptElement>>();

/** Loads an external browser script once and shares concurrent requests. */
export const loadScript = (
  source: string,
  attributes: Readonly<Record<string, string>> = {}
): Promise<HTMLScriptElement> => {
  const base = document.baseURI === "about:blank" ? "https://localhost/" : document.baseURI;
  const url = new URL(source, base).href;
  const existing = Array.from(document.scripts).find((script) => script.src === url);
  if (existing?.dataset.loaded === "true") return Promise.resolve(existing);
  const cached = pending.get(url);
  if (cached) return cached;

  const script = existing ?? document.createElement("script");
  for (const [name, value] of Object.entries(attributes)) script.setAttribute(name, value);
  script.src = url;
  const promise = new Promise<HTMLScriptElement>((resolve, reject) => {
    const loaded = () => {
      script.dataset.loaded = "true";
      cleanup();
      resolve(script);
    };
    const failed = () => {
      cleanup();
      if (!existing) script.remove();
      reject(new Error(`Failed to load script: ${url}`));
    };
    const cleanup = () => {
      script.removeEventListener("load", loaded);
      script.removeEventListener("error", failed);
      pending.delete(url);
    };
    script.addEventListener("load", loaded, { once: true });
    script.addEventListener("error", failed, { once: true });
    if (!existing) document.head.append(script);
  });
  pending.set(url, promise);
  return promise;
};
