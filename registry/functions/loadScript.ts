const pending = new Map<string, Promise<HTMLScriptElement>>();
const states = new WeakMap<HTMLScriptElement, "loading" | "loaded" | "failed">();

export type LoadScriptAttributes = Readonly<Record<string, string>>;

/** Loads an external browser script with URL deduplication and retryable failures. */
export const loadScript = (
  source: string,
  attributes: LoadScriptAttributes = {}
): Promise<HTMLScriptElement> => {
  const normalizedSource = source.trim();
  if (normalizedSource.length === 0) {
    return Promise.reject(new TypeError("source must not be empty"));
  }

  let url: string;
  try {
    const base =
      document.baseURI === "about:blank"
        ? "https://localhost/"
        : document.baseURI;
    url = new URL(normalizedSource, base).href;
  } catch (error) {
    return Promise.reject(error);
  }
  const cached = pending.get(url);
  if (cached) return cached;

  const matching = Array.from(document.scripts).filter((script) => script.src === url);
  const ready = matching.find((script) => states.get(script) === "loaded")
    ?? matching.find((script) => !states.has(script));
  if (ready) return Promise.resolve(ready);

  for (const failed of matching.filter((script) => states.get(script) === "failed")) {
    failed.remove();
  }

  const existing = matching.find((script) => states.get(script) === "loading");
  const script = existing ?? document.createElement("script");
  const created = existing === undefined;

  if (created) {
    try {
      for (const [name, value] of Object.entries(attributes)) {
        const normalizedName = name.toLowerCase();
        if (normalizedName !== "src") script.setAttribute(name, value);
      }
      states.set(script, "loading");
      script.src = url;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  let resolvePromise: (script: HTMLScriptElement) => void = () => {};
  let rejectPromise: (error: unknown) => void = () => {};
  const promise = new Promise<HTMLScriptElement>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  pending.set(url, promise);

  let settled = false;
  const cleanup = () => {
    script.removeEventListener("load", loaded);
    script.removeEventListener("error", failed);
    if (pending.get(url) === promise) pending.delete(url);
  };
  const loaded = () => {
    if (settled) return;
    settled = true;
    states.set(script, "loaded");
    cleanup();
    resolvePromise(script);
  };
  const failed = () => {
    if (settled) return;
    settled = true;
    states.set(script, "failed");
    cleanup();
    script.remove();
    rejectPromise(new Error(`Failed to load script: ${url}`));
  };

  script.addEventListener("load", loaded, { once: true });
  script.addEventListener("error", failed, { once: true });

  if (created) {
    try {
      document.head.append(script);
    } catch {
      failed();
    }
  }

  return promise;
};
