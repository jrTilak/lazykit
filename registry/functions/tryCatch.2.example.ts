import { tryCatch } from "./tryCatch";

const [error] = tryCatch(
  (): unknown => JSON.parse("invalid json")
);

if (error) console.error("Could not parse the value", error);
