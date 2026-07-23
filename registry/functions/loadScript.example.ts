import { loadScript, type LoadScriptAttributes } from "./loadScript";

const attributes = {
  integrity: "sha384-...",
  crossorigin: "anonymous",
  referrerpolicy: "no-referrer"
} satisfies LoadScriptAttributes;

const script: HTMLScriptElement = await loadScript(
  "https://cdn.example.com/widget.js",
  attributes
);
