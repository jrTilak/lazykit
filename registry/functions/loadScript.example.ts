import { loadScript } from "./loadScript";

await loadScript("https://cdn.example.com/widget.js", {
  integrity: "sha384-...",
  crossorigin: "anonymous"
});
