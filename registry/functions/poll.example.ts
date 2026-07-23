import { poll } from "./poll";

const job = await poll(
  () => fetch("/api/job").then((response) => response.json()),
  {
    until: (value) => value.status === "complete",
    intervalMs: 1000,
    maxAttempts: 30
  }
);
